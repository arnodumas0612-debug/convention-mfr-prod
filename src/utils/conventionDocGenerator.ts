import { Document, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun, Packer, PageBreak, VerticalAlign } from 'docx';
import { saveAs } from 'file-saver';
import { Convention, StagePeriod, Signature } from '../types/convention';

async function imageUrlToBase64(url: string): Promise<{ data: Uint8Array; width: number; height: number }> {
  const response = await fetch(url);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  return {
    data: uint8Array,
    width: 150,
    height: 50
  };
}

export async function generateConventionDocument(
  convention: Convention,
  periods: StagePeriod[],
  signatures: { [key: string]: Signature }
) {
  // Charger les logos
  let logoMfrData: { data: Uint8Array; width: number; height: number } | null = null;
  let logoGonthiereData: { data: Uint8Array; width: number; height: number } | null = null;

  try {
    logoMfrData = await imageUrlToBase64('/logo-mfr.png');
    logoMfrData.width = 100;
    logoMfrData.height = 80;
  } catch (e) {
    console.error('Erreur lors du chargement du logo MFR:', e);
  }

  try {
    logoGonthiereData = await imageUrlToBase64('/logo-federation.png');
    logoGonthiereData.width = 100;
    logoGonthiereData.height = 80;
  } catch (e) {
    console.error('Erreur lors du chargement du logo Gonthière:', e);
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1134,
            right: 1134,
            bottom: 1134,
            left: 1134,
          },
        },
      },
      children: [
        // Logos en haut
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.LEFT,
                      children: logoMfrData ? [
                        new ImageRun({
                          data: logoMfrData.data,
                          transformation: {
                            width: logoMfrData.width,
                            height: logoMfrData.height,
                          },
                        }),
                      ] : [],
                    }),
                  ],
                  width: { size: 33, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                }),
                new TableCell({
                  children: [new Paragraph({ text: '' })],
                  width: { size: 34, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      children: logoGonthiereData ? [
                        new ImageRun({
                          data: logoGonthiereData.data,
                          transformation: {
                            width: logoGonthiereData.width,
                            height: logoGonthiereData.height,
                          },
                        }),
                      ] : [],
                    }),
                  ],
                  width: { size: 33, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                }),
              ],
            }),
          ],
        }),

        // En-tête - Page 1
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'Page 1 sur 4',
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'CONVENTION RELATIVE AUX STAGES D\'INITIATION PRÉVUS AUX ARTICLES R. 715-1 ET R. 715-1-3 DU ',
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: 'CODE RURAL ET DE LA PÊCHE MARITIME',
              bold: true,
              size: 20,
              color: '0000FF',
              underline: {},
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: 'La présente convention a pour objet la mise en œuvre, au bénéfice de l\'élève dénommé ci-après d\'une période de stage d\'initiation en milieu professionnel rendue obligatoire par le programme officiel de la classe dans laquelle il est inscrit. Cette convention, signée par les parties, précise les conditions de mise en œuvre de ce stage.',
              size: 20,
            }),
          ],
        }),

        // Tableau 2 colonnes : Établissement | Entreprise
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6 },
            bottom: { style: BorderStyle.SINGLE, size: 6 },
            left: { style: BorderStyle.SINGLE, size: 6 },
            right: { style: BorderStyle.SINGLE, size: 6 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 6 },
            insideVertical: { style: BorderStyle.SINGLE, size: 6 },
          },
          rows: [
            // En-têtes
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: '1. L\'ÉTABLISSEMENT D\'ENSEIGNEMENT',
                          bold: true,
                          size: 20,
                        }),
                      ],
                    }),
                  ],
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.CENTER,
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: '2. L\'ENTREPRISE OU L\'ORGANISME D\'ACCUEIL',
                          bold: true,
                          size: 20,
                        }),
                      ],
                    }),
                  ],
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.CENTER,
                }),
              ],
            }),
            // Contenu
            new TableRow({
              children: [
                // Colonne gauche - Établissement
                new TableCell({
                  children: [
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Adresse : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: 'MFR « La Petite Gonthière » - 175, route des Crêtes- 69480 ANSE.',
                          size: 18,
                          color: '0000FF',
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Tél. : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: '04 74 60 42 22',
                          size: 18,
                          color: '0000FF',
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Représenté par le chef d\'établissement :',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Nom : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: 'VENET',
                          size: 18,
                          color: '0000FF',
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Prénom : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: 'Sébastien',
                          size: 18,
                          color: '0000FF',
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Tél. : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: '04 74 60 42 22',
                          size: 18,
                          color: '0000FF',
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: 'Mél : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: 'mfr.anse@mfr.asso.fr',
                          size: 18,
                          color: '0000FF',
                        }),
                      ],
                    }),
                  ],
                  verticalAlign: VerticalAlign.TOP,
                }),
                // Colonne droite - Entreprise
                new TableCell({
                  children: [
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Adresse : ',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: convention.company_address || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Numéro d\'immatriculation SIREN ou SIRET : ',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: convention.company_siren || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Représenté par (nom du signataire de la convention)',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Nom : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.company_signatory_lastname || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Prénom : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.company_signatory_firstname || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Qualité du représentant : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.company_signatory_title || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Tél. : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.company_phone || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Mél : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.company_email || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: 'Lieu du stage (si différent de l\'adresse de l\'organisme) : ',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: convention.stage_location || '',
                          size: 18,
                        }),
                      ],
                    }),
                  ],
                  verticalAlign: VerticalAlign.TOP,
                }),
              ],
            }),
          ],
        }),

        // Tableau 2 colonnes : Élève | Responsable légal
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6 },
            bottom: { style: BorderStyle.SINGLE, size: 6 },
            left: { style: BorderStyle.SINGLE, size: 6 },
            right: { style: BorderStyle.SINGLE, size: 6 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 6 },
            insideVertical: { style: BorderStyle.SINGLE, size: 6 },
          },
          rows: [
            // En-têtes
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: '3. L\'ÉLÈVE',
                          bold: true,
                          size: 20,
                        }),
                      ],
                    }),
                  ],
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.CENTER,
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: '4. Si l\'élève est mineur : représenté par son responsable légal',
                          bold: true,
                          size: 20,
                        }),
                      ],
                    }),
                  ],
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.CENTER,
                }),
              ],
            }),
            // Contenu
            new TableRow({
              children: [
                // Colonne gauche - Élève
                new TableCell({
                  children: [
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Nom : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.student_lastname || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Prénom : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.student_firstname || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Sexe : F ☐ M ☐',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: '  Né(e) le : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.student_birthdate || '___/___/____',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Adresse : ',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: convention.student_address || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Tél. : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.student_phone || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Mél : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.student_email || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Préparant le diplôme : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: 'Diplôme National du Brevet (DNB) /4ème et 3ème de l\'Enseignement Agricole',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: 'En classe de : ☐ 4ème  ☐ 3ème',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                  ],
                  verticalAlign: VerticalAlign.TOP,
                }),
                // Colonne droite - Responsable légal
                new TableCell({
                  children: convention.is_minor ? [
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Nom : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.guardian_lastname || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Prénom : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.guardian_firstname || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Adresse : ',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: convention.guardian_address || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Tél. : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.guardian_phone || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: 'Mél : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.guardian_email || '',
                          size: 18,
                        }),
                      ],
                    }),
                  ] : [
                    new Paragraph({ text: '' }),
                  ],
                  verticalAlign: VerticalAlign.TOP,
                }),
              ],
            }),
          ],
        }),

        // Article 1er
        new Paragraph({
          spacing: { before: 300, after: 100 },
          children: [
            new TextRun({
              text: 'Il est convenu ce qui suit :',
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'Article 1er',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: 'Dispositions générales',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Seuls les élèves âgés de 14 ans au moins peuvent effectuer le stage ou la séquence pédagogique au sens de l\'article R. 813-42 du code rural et de la pêche maritime qui fait l\'objet de la présente convention.\nCe stage, ou cette séquence pédagogique au sens de l\'article R. 813-42 du code rural ou de la pêche maritime, a pour objectif de permettre à l\'élève de découvrir différents milieux professionnels. Il est organisé dans les conditions fixées par les arrêtés du 23 juillet 2015, modifiant les arrêtés du 11 mars 2013, portant organisation des enseignements dans les classes de quatrième et de troisième de l\'enseignement agricole et par l\'arrêté du 20 juin 2016 relatif aux enseignements dans ces mêmes classes.',
              size: 18,
            }),
          ],
        }),

        // ============= PAGE 2 =============
        new Paragraph({
          children: [new PageBreak()],
        }),

        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Page 2 sur 4',
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: 'Au cours de ce stage d\'initiation, l\'élève peut effectuer des activités pratiques simples et variées, correspondant à l\'enseignement reçu, et sous surveillance du maître de stage ou du tuteur désigné par l\'entreprise ou l\'organisme d\'accueil, des travaux légers autorisés aux mineurs par l\'article R. 715-2 code rural et de la pêche maritime. L\'employeur veille à ce que la participation à ces activités ne porte pas préjudice à la situation de l\'emploi dans l\'entreprise. L\'élève est par ailleurs tenu à un devoir de discrétion professionnelle.',
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Le stagiaire demeure pendant toute la durée de sa formation sous statut scolaire et reste, à ce titre, sous l\'autorité du chef de son établissement d\'enseignement et de formation professionnelle agricoles.',
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Ce stage est réalisé sous l\'encadrement et la surveillance du maître de stage ou tuteur désigné à cet effet par le chef d\'entreprise ou le responsable de l\'organisme d\'accueil lorsque celui-ci n\'est pas lui-même maître du stage ou tuteur.',
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: 'Le maître de stage ou le tuteur doit assurer un suivi du stagiaire pendant la séquence en milieu professionnel et lui permettre de préparer son rapport, en lui accordant le temps nécessaire.',
              size: 18,
            }),
          ],
        }),

        // Encadré gris - Caractéristiques
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6 },
            bottom: { style: BorderStyle.SINGLE, size: 6 },
            left: { style: BorderStyle.SINGLE, size: 6 },
            right: { style: BorderStyle.SINGLE, size: 6 },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: '5. Caractéristiques du stage (domaine professionnel) : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: convention.main_tasks || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Dates : du',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: periods.length > 0 ? ` ${periods[0].start_date}` : '………………………………………',
                          size: 18,
                        }),
                        new TextRun({
                          text: ' au',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: periods.length > 0 ? ` ${periods[periods.length - 1].end_date}` : '………………………………………………',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Nombre de semaines : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: periods.length > 0 ? periods.length.toString() : '………………………………….',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Détail des périodes de stage :',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Table({
                      width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                      },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.NONE },
                        insideVertical: { style: BorderStyle.NONE },
                      },
                      rows: [
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [
                                ...periods.map((period, index) =>
                                  new Paragraph({
                                    spacing: { after: 50 },
                                    children: [
                                      new TextRun({
                                        text: `- Du ${period.start_date} au ${period.end_date}`,
                                        size: 18,
                                        color: '0000FF',
                                      }),
                                    ],
                                  })
                                ),
                                ...(periods.length < 7 ? Array.from({ length: 7 - periods.length }).map(() =>
                                  new Paragraph({
                                    spacing: { after: 50 },
                                    children: [
                                      new TextRun({
                                        text: '- Du …………………………….. au ………………………………………',
                                        size: 18,
                                      }),
                                    ],
                                  })
                                ) : []),
                              ],
                              width: { size: 50, type: WidthType.PERCENTAGE },
                              verticalAlign: VerticalAlign.TOP,
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  spacing: { after: 50 },
                                  children: [
                                    new TextRun({
                                      text: 'HORAIRES :',
                                      bold: true,
                                      size: 18,
                                    }),
                                  ],
                                }),
                                ...['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(day =>
                                  new Paragraph({
                                    spacing: { after: 50 },
                                    children: [
                                      new TextRun({
                                        text: `${day} : `,
                                        size: 18,
                                      }),
                                      new TextRun({
                                        text: periods.length > 0 && periods[0].daily_hours ? periods[0].daily_hours : '………………………………………………………….',
                                        size: 18,
                                        color: '0000FF',
                                      }),
                                    ],
                                  })
                                ),
                              ],
                              width: { size: 50, type: WidthType.PERCENTAGE },
                              verticalAlign: VerticalAlign.TOP,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      spacing: { before: 100, after: 100 },
                      children: [
                        new TextRun({
                          text: 'Objectifs du stage et des parties correspondantes du référentiel du diplôme (de la classe) concerné(e) :',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 50 },
                      children: [
                        new TextRun({
                          text: '- découverte de l\'entreprise de son intérêt, de ses exigences et contraintes',
                          bold: true,
                          size: 18,
                          color: '0000FF',
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 50 },
                      children: [
                        new TextRun({
                          text: '- s\'emparer de la question de la santé et sécurité au travail',
                          bold: true,
                          size: 18,
                          color: '0000FF',
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: '- évaluer une filière dans le but de s\'orienter',
                          bold: true,
                          size: 18,
                          color: '0000FF',
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: 'Principales tâches confiées au stagiaire :',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        new TextRun({
                          text: convention.main_tasks || '',
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: 'Place du stage dans l\'évaluation : ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: 'Néant',
                          bold: true,
                          size: 18,
                          color: '0000FF',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // Articles 2, 3, 4 - PAGE 2 (suite)
        new Paragraph({
          spacing: { before: 300, after: 100 },
          children: [
            new TextRun({
              text: 'Article 2',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: 'Dispositions en matière de santé-sécurité au travail',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Le chef d\'établissement d\'enseignement veille, en mettant en œuvre les diligences normales, à ce que les conditions de déroulement du stage soient de nature à préserver la santé et la sécurité de l\'élève et à garantir le respect du stagiaire contre toute forme de violence et de discrimination.\nLes obligations du chef d\'entreprise, ou du responsable de l\'organisme d\'accueil ou de son représentant sont notamment de :',
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: '- présenter au stagiaire l\'évaluation des risques propres à son entreprise et commenter de manière pédagogique avec lui les risques auxquels il est susceptible d\'être exposé et les mesures prises pour y remédier ;\n- diriger et contrôler le stagiaire par la désignation d\'un maître de stage ou tuteur chargé d\'assurer ce suivi ;\n- faire accomplir au stagiaire des travaux correspondant à la fois à ses aptitudes, aux objectifs du stage et à la progression pédagogique du stagiaire ;\n- si ces travaux incluent une utilisation de matériel, indiquer le type de matériel et ses conditions d\'utilisation (encadrement, port d\'équipements de protection individuelle, formation…). Le chef d\'entreprise ou le responsable de l\'organisme d\'accueil doit ne faire utiliser que des matériels conformes à la réglementation. Au cours de ce stage d\'initiation l\'élève ne peut en aucun cas réaliser les travaux visés aux articles D. 4153-16 à D. 4153-38 du code du travail ni effectuer ceux visés aux articles R. 4153-50 à R. 4153-52 du code du travail.',
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'Article 3',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: 'Dispositions financières et gratification du stagiaire',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: 'Du fait de ce statut scolaire, le stagiaire ne peut prétendre à aucune rémunération de la part de l\'entreprise ou de l\'organisme d\'accueil. Toutefois, conformément à l\'article L. 124-6 du code de l\'éducation, une gratification peut lui être versée. Celle-ci est exonérée de charges sociales si, conformément au b du 1° du III de l\'article L. 136-1-1 et à l\'article D. 136-1 du code de la sécurité sociale, son montant ne dépasse pas le seuil équivalent au produit de 15,00 %',
              size: 18,
            }),
          ],
        }),

        // ============= PAGE 3 =============
        new Paragraph({
          children: [new PageBreak()],
        }),

        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Page 3 sur 4',
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: 'du plafond horaire de la sécurité sociale et du nombre d\'heures de stage effectuées au cours du mois considéré. Ce montant tient compte des avantages en nature et en espèces et du temps de présence mensuelle prévu au cours du mois considéré. Lorsque le montant de la gratification dépasse le plafond indiqué ci-dessus, les obligations de l\'employeur incombent à l\'entreprise ou à l\'organisme d\'accueil.',
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: 'L\'élève ne doit pas être pris en compte pour l\'appréciation des effectifs de l\'entreprise et ne peut pas prendre part à une quelconque élection professionnelle.',
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: 'Il est soumis aux règles générales en vigueur au sein de l\'entreprise d\'accueil, notamment en matière de sécurité, d\'horaires et de discipline, sous réserve des dispositions de l\'article 4 de la présente convention.',
              size: 18,
            }),
          ],
        }),

        // Article 4
        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'Article 4',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: 'Dispositions en matière de temps de travail',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Pendant ces séquences d\'observation, ces stages ou ces périodes de formation en milieu professionnel, le total du temps de stage de l\'élève dans l\'entreprise ou l\'organisme d\'accueil et du temps consacré à sa formation dans l\'établissement d\'enseignement ne peut excéder sept heures par jour et trente-deux heures par semaine. Cette dernière limite est portée à trente-cinq heures par semaine pour les élèves qui ont atteint l\'âge de quinze ans.\nPour l\'application de l\'article L. 3162-3 du code du travail, une pause d\'au moins trente minutes est accordée après une période de travail effectif ininterrompue de quatre heures et demie.\nLes jeunes travailleurs agricoles doivent en outre bénéficier, pour chaque période de vingt-quatre heures, d\'un temps de repos fixé à quatorze heures s\'ils sont encore soumis à l\'obligation scolaire et à douze heures s\'ils ne sont plus soumis à l\'obligation scolaire.\nLes dérogations au repos dominical ne s\'appliquent pas aux jeunes de moins de 16 ans qui doivent bénéficier de deux jours consécutifs de repos hebdomadaire comprenant obligatoirement le dimanche.\nEn revanche les dérogations de droit au repos dominical s\'appliquent aux jeunes de 16 à 18 ans, dans les mêmes conditions que les adultes, à la différence près qu\'ils bénéficient obligatoirement de deux jours consécutifs de repos chaque semaine.\nLes horaires journaliers ne peuvent prévoir la présence sur le lieu de stage entre 22 heures et 6 heures pour les élèves mineurs de plus de 16 ans et de moins de 18 ans et entre 20 heures et 6 heures pour ceux de moins de 16 ans.',
              size: 18,
            }),
          ],
        }),

        // Articles 5, 6, 7
        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'Article 5',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: 'Responsabilité civile et assurances',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Le chef d\'entreprise ou le responsable de l\'organisme d\'accueil prend les dispositions nécessaires pour garantir sa responsabilité civile chaque fois qu\'elle sera engagée :',
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: '- soit en souscrivant une assurance particulière garantissant sa responsabilité civile en cas de faute imputable à l\'entreprise à l\'égard du stagiaire ;\n- soit en ajoutant à son contrat déjà souscrit « responsabilité civile entreprise » ou « responsabilité civile professionnelle » un avenant relatif au stagiaire.',
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: 'Le chef de l\'établissement d\'enseignement contracte une assurance couvrant la responsabilité civile de l\'élève pour les dommages qu\'il pourrait causer pendant la durée ou à l\'occasion de son stage ainsi qu\'en dehors de l\'entreprise ou de l\'organisme d\'accueil ou sur le trajet menant au lieu de stage ou au domicile.',
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'Article 6',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: 'Dispositions en cas d\'accident du travail',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'En application des dispositions des articles L. 751-1-II (1°), L. 761-14 (1°) du code rural et de la pêche maritime et de l\'article L. 412-8 (2° a) du code de la sécurité sociale, les stagiaires de l\'enseignement agricole bénéficient de la législation sur les accidents de travail.\nEn cas d\'accident survenu à l\'élève stagiaire soit au cours du travail, soit au cours du trajet, le responsable de l\'entreprise ou de l\'organisme d\'accueil s\'engage à informer le chef d\'établissement d\'enseignement dans la journée où s\'est produit l\'accident ou au plus tard dans les 24 heures.\nLa déclaration d\'accident du travail doit être faite par le chef d\'établissement d\'enseignement, par tout moyen de transmission à la caisse de mutualité sociale agricole, la caisse assurances accidents agricoles pour l\'Alsace-Moselle, ou la caisse générale de sécurité sociale pour les départements d\'outre-mer, dont relève l\'établissement, dans les 48 heures, non compris les dimanches et jours fériés, à compter de l\'information faite par l\'entreprise.',
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'Article 7',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: 'Fin anticipée du stage',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: 'Le chef d\'établissement d\'enseignement et le chef d\'entreprise ou le responsable de l\'organisme d\'accueil ou son',
              size: 18,
            }),
          ],
        }),

        // ============= PAGE 4 =============
        new Paragraph({
          children: [new PageBreak()],
        }),

        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Page 4 sur 4',
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'représentant se tiennent mutuellement informés des difficultés, notamment celles liées aux absences éventuelles du stagiaire, qui pourraient naître de l\'application de la présente convention et prendront d\'un commun accord, en liaison avec l\'équipe pédagogique, les dispositions adéquates pour y mettre un terme.',
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'En tout état de cause, le chef d\'entreprise ou le responsable de l\'organisme d\'accueil ou son représentant peut décider, après en avoir informé le chef d\'établissement d\'enseignement, de mettre fin de manière anticipée au stage en cas de manquement grave à la discipline de la part du stagiaire.',
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: 'Le chef d\'établissement d\'enseignement met fin au stage à tout moment dès lors que l\'entreprise ou l\'organisme d\'accueil ne satisfait plus :\n- aux conditions de santé et de sécurité au travail et de moralité indispensables au bon déroulement du stage ;\n- aux conditions d\'encadrement nécessaires à la mise en œuvre des objectifs prévus par la présente convention.',
              size: 18,
            }),
          ],
        }),

        // Article 8
        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'Article 8',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: 'Autres dispositions',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'La présente convention s\'applique aux stages ainsi qu\'aux séquences pédagogiques de l\'enseignement à rythme approprié, dont le référentiel de formation prévoit expressément qu\'ils puissent se dérouler en partie hors temps scolaire, et ce dans la limite de temps qu\'il précise. Ces périodes sont antérieures à l\'obtention du diplôme.\nSi le chef d\'entreprise ou le responsable de l\'organisme d\'accueil occupe le jeune de sa propre initiative en dehors des périodes prévues par la convention de stage qu\'il a signée avec le chef d\'établissement d\'enseignement, il fait perdre au jeune son statut scolaire avec comme conséquence l\'acquisition de la qualité de salarié et l\'obligation pour l\'entreprise ou l\'organisme d\'accueil de procéder à la déclaration préalable à l\'embauche et de verser un salaire et les cotisations qui en découlent.\nEn tout état de cause, pour les jeunes de moins de 16 ans, ces périodes hors temps scolaire (en qualité de stagiaire ou en qualité de salarié) ne peuvent excéder la moitié du temps des vacances scolaires concernées.',
              size: 18,
            }),
          ],
        }),

        // Article 9
        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'Article 9',
              bold: true,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: 'Un exemplaire de la présente convention est remis, après signature du chef d\'entreprise ou du responsable de l\'organisme d\'accueil ou son représentant et du chef d\'établissement d\'enseignement, à l\'élève et/ou son représentant légal ainsi qu\'au maître de stage et au professeur coordonnateur de la filière ou son représentant.',
              size: 18,
            }),
          ],
        }),

        // Signatures
        new Paragraph({
          spacing: { before: 200, after: 200 },
          children: [
            new TextRun({
              text: `Fait à ${convention.signing_location || '…………………………………'} le ${convention.signing_date || '…………………………………………………………'}`,
              size: 20,
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: '(en trois exemplaires)',
              italic: true,
              size: 18,
            }),
          ],
        }),

        // Tableau des signatures
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6 },
            bottom: { style: BorderStyle.SINGLE, size: 6 },
            left: { style: BorderStyle.SINGLE, size: 6 },
            right: { style: BorderStyle.SINGLE, size: 6 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 6 },
            insideVertical: { style: BorderStyle.SINGLE, size: 6 },
          },
          rows: [
            new TableRow({
              height: { value: 1800, rule: "atLeast" },
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: 'Le chef d\'entreprise ou',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: 'Le responsable de l\'organisme d\'accueil,',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { before: 100 },
                      children: [
                        new TextRun({
                          text: `${convention.company_signatory_firstname || ''} ${convention.company_signatory_lastname || ''}`,
                          size: 18,
                        }),
                      ],
                    }),
                    ...(signatures['maitre_stage'] ? [
                      new Paragraph({
                        spacing: { before: 200 },
                        children: [
                          new ImageRun({
                            data: (await imageUrlToBase64(signatures['maitre_stage'].signature_data)).data,
                            transformation: {
                              width: 150,
                              height: 50,
                            },
                          }),
                        ],
                      }),
                    ] : [
                      new Paragraph({
                        spacing: { before: 200 },
                        children: [new TextRun({ text: '', size: 18 })],
                      }),
                    ]),
                  ],
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.TOP,
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: 'Le chef de l\'établissement d\'enseignement, ',
                          bold: true,
                          size: 18,
                        }),
                        new TextRun({
                          text: 'VENET Sébastien',
                          bold: true,
                          size: 18,
                          color: '0000FF',
                        }),
                      ],
                    }),
                    ...(signatures['chef_etablissement'] ? [
                      new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                          new ImageRun({
                            data: (await imageUrlToBase64(signatures['chef_etablissement'].signature_data)).data,
                            transformation: {
                              width: 150,
                              height: 50,
                            },
                          }),
                        ],
                      }),
                    ] : [
                      new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [new TextRun({ text: '', size: 18 })],
                      }),
                    ]),
                    new Paragraph({
                      spacing: { before: 200 },
                      children: [
                        new TextRun({
                          text: 'Le responsable de Classe ou du pôle 4ème/3ème (le cas échéant),',
                          bold: true,
                          size: 18,
                        }),
                      ],
                    }),
                    ...(signatures['responsable_classe'] ? [
                      new Paragraph({
                        spacing: { before: 100 },
                        children: [
                          new ImageRun({
                            data: (await imageUrlToBase64(signatures['responsable_classe'].signature_data)).data,
                            transformation: {
                              width: 150,
                              height: 50,
                            },
                          }),
                        ],
                      }),
                    ] : [
                      new Paragraph({
                        spacing: { before: 100 },
                        children: [new TextRun({ text: '', size: 18 })],
                      }),
                    ]),
                  ],
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.TOP,
                }),
              ],
            }),
          ],
        }),

        // Visas en dessous du tableau
        new Paragraph({
          spacing: { before: 300, after: 100 },
          children: [
            new TextRun({
              text: 'Visa du maître de stage ou tuteur (s\'il est distinct du chef d\'entreprise ou du responsable l\'organisme d\'accueil).',
              bold: true,
              size: 18,
            }),
          ],
        }),

        new Paragraph({
          spacing: { before: 300, after: 100 },
          children: [
            new TextRun({
              text: 'Visa du stagiaire,',
              bold: true,
              size: 18,
            }),
          ],
        }),

        ...(signatures['student'] ? [
          new Paragraph({
            spacing: { before: 100, after: 200 },
            children: [
              new ImageRun({
                data: (await imageUrlToBase64(signatures['student'].signature_data)).data,
                transformation: {
                  width: 150,
                  height: 50,
                },
              }),
            ],
          }),
        ] : []),

        new Paragraph({
          spacing: { before: 300 },
          children: [
            new TextRun({
              text: 'Le cas échéant (si l\'élève est mineur), visa du représentant légal du stagiaire.',
              bold: true,
              size: 18,
            }),
          ],
        }),

        ...(convention.is_minor && signatures['parent'] ? [
          new Paragraph({
            spacing: { before: 100 },
            children: [
              new ImageRun({
                data: (await imageUrlToBase64(signatures['parent'].signature_data)).data,
                transformation: {
                  width: 150,
                  height: 50,
                },
              }),
            ],
          }),
        ] : []),
      ],
    }],
  });

  return doc;
}

export async function downloadConvention(
  convention: Convention,
  periods: StagePeriod[],
  signatures: { [key: string]: Signature }
) {
  const doc = await generateConventionDocument(convention, periods, signatures);

  const blob = await Packer.toBlob(doc);

  const filename = `Convention_${convention.student_lastname}_${convention.student_firstname}_${new Date().toISOString().split('T')[0]}.docx`;
  saveAs(blob, filename);
}
