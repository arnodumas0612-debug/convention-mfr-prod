import { createReport } from 'docx-templates';
import { saveAs } from 'file-saver';

export const generateConventionDocx = async (
  convention: any,
  signatures: any[]
): Promise<void> => {
  try {
    let templatePath = '';
    const classe = convention.classe?.toLowerCase() || '';

    if (classe.includes('4') || classe.includes('3')) {
      templatePath = '/templates/CONVENTION_4eme_3eme_FINAL.docx';
    } else if (classe.includes('2')) {
      templatePath = '/templates/CONVENTION_2nd_FINAL.docx';
    } else if (classe.includes('1') || classe.includes('term')) {
      templatePath = '/templates/CONVENTION_1ère_TERM_FINAL.docx';
    } else {
      throw new Error('Classe non reconnue');
    }

    const response = await fetch(templatePath);
    const templateArrayBuffer = await response.arrayBuffer();
    const templateBuffer = new Uint8Array(templateArrayBuffer);

    const base64ToBuffer = (base64: string): ArrayBuffer | null => {
      if (!base64) return null;
      try {
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      } catch (error) {
        console.error('Erreur conversion base64:', error);
        return null;
      }
    };

    const getSignature = (role: string) => {
      const sig = signatures.find((s: any) => s.signer_role === role);
      if (!sig?.signature_data) return null;

      const buffer = base64ToBuffer(sig.signature_data);
      if (!buffer) return null;

      return {
        width: 4,
        height: 1.5,
        data: buffer,
        extension: '.png',
      };
    };

    const data: any = {
      student_lastname: convention.student_lastname || '',
      student_firstname: convention.student_firstname || '',
      student_gender: convention.student_gender === 'M' ? 'M ☑ F ☐' : 'M ☐ F ☑',
      student_birthdate: new Date(convention.student_birthdate).toLocaleDateString('fr-FR'),
      student_address: convention.student_address || '',
      student_phone: convention.student_phone || '',
      student_email: convention.student_email || '',
      diplome_prepare: convention.diplome_prepare || 'Diplôme National du Brevet',
      classe: convention.classe || '',
      legal_rep_lastname: convention.is_minor ? convention.legal_rep_lastname : '',
      legal_rep_firstname: convention.is_minor ? convention.legal_rep_firstname : '',
      legal_rep_address: convention.is_minor ? convention.legal_rep_address : '',
      legal_rep_phone: convention.is_minor ? convention.legal_rep_phone : '',
      legal_rep_email: convention.is_minor ? convention.legal_rep_email : '',
      entreprise_adresse: convention.entreprise_adresse || '',
      entreprise_siren: convention.entreprise_siren || '',
      entreprise_representant_nom: convention.entreprise_representant_nom || '',
      entreprise_representant_prenom: convention.entreprise_representant_prenom || '',
      qualite_representant: convention.qualite_representant || 'Responsable',
      entreprise_telephone: convention.entreprise_telephone || '',
      entreprise_email: convention.entreprise_email || '',
      enseignant_referent_nom: convention.enseignant_referent_nom || '',
      enseignant_referent_prenom: convention.enseignant_referent_prenom || '',
      enseignant_referent_fonction: convention.enseignant_referent_fonction || '',
      enseignant_referent_email: convention.enseignant_referent_email || '',
      tuteur_entreprise_nom: convention.tuteur_entreprise_nom || '',
      tuteur_entreprise_prenom: convention.tuteur_entreprise_prenom || '',
      tuteur_entreprise_fonction: convention.tuteur_entreprise_fonction || '',
      tuteur_entreprise_telephone: convention.tuteur_entreprise_telephone || '',
      tuteur_entreprise_email: convention.tuteur_entreprise_email || '',
      domaine_professionnel: convention.domaine_professionnel || '',
      lieu_stage: convention.lieu_stage || '',
      taches_principales: convention.taches_principales || '',
      date_debut: convention.stage_periods?.[0]?.start_date
        ? new Date(convention.stage_periods[0].start_date).toLocaleDateString('fr-FR')
        : '',
      date_fin: convention.stage_periods?.[convention.stage_periods.length - 1]?.end_date
        ? new Date(convention.stage_periods[convention.stage_periods.length - 1].end_date).toLocaleDateString('fr-FR')
        : '',
      annee_scolaire: convention.annee_scolaire || '2025/2026',
      duree_hebdomadaire: convention.duree_hebdomadaire || '35',
      horaires_lundi: convention.horaires_lundi || '8h-12h / 14h-18h',
      horaires_mardi: convention.horaires_mardi || '8h-12h / 14h-18h',
      horaires_mercredi: convention.horaires_mercredi || '8h-12h / 14h-18h',
      horaires_jeudi: convention.horaires_jeudi || '8h-12h / 14h-18h',
      horaires_vendredi: convention.horaires_vendredi || '8h-12h / 14h-18h',
      horaires_samedi: convention.horaires_samedi || '',
      stage_periods: convention.stage_periods?.map((p: any) => ({
        start_date: new Date(p.start_date).toLocaleDateString('fr-FR'),
        end_date: new Date(p.end_date).toLocaleDateString('fr-FR'),
      })) || [],
      signature_stagiaire: getSignature('student'),
      signature_parent: getSignature('parent'),
      signature_entreprise: getSignature('maitre_stage'),
      signature_responsable_classe: getSignature('responsable_classe'),
      signature_chef_etablissement: getSignature('chef_etablissement'),
      signature_enseignant: getSignature('enseignant_referent'),
      signature_tuteur: getSignature('tuteur'),
      date_signature: new Date().toLocaleDateString('fr-FR'),
    };

    const reportBuffer = await createReport({
      template: templateBuffer,
      data: data,
      cmdDelimiter: ['{{', '}}'],
    }) as any;

    const report = reportBuffer instanceof Uint8Array
      ? reportBuffer
      : new Uint8Array(reportBuffer as ArrayBuffer);

    const blob = new Blob([report], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    const filename = `Convention_${convention.student_lastname}_${convention.student_firstname}.docx`;
    saveAs(blob, filename);

  } catch (error) {
    console.error('Erreur génération docx:', error);
    throw error;
  }
};
