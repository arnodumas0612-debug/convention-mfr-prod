import { ConventionType } from '../types/convention';

/**
 * Détermine le type de convention selon la classe de l'élève
 */
export function getConventionType(studentClass: string): ConventionType {
  const classLower = studentClass.toLowerCase().trim();

  // 4ème et 3ème => stages d'initiation
  if (classLower === '4ème' || classLower === '3èmea' || classLower === '3èmen') {
    return 'stage_initiation';
  }

  // 2nde => PFMP Seconde
  if (classLower === '2nde1' || classLower === '2nde2') {
    return 'pfmp_seconde';
  }

  // 1ère et Terminale => PFMP 1ère/Terminale
  if (classLower === '1ère1' || classLower === '1ère2' || classLower === 'term1' || classLower === 'term2') {
    return 'pfmp_premiere_terminale';
  }

  // Par défaut, stage d'initiation
  return 'stage_initiation';
}

/**
 * Retourne le titre du document selon le type de convention
 */
export function getConventionTitle(type: ConventionType): string {
  switch (type) {
    case 'stage_initiation':
      return 'CONVENTION RELATIVE AUX STAGES D\'INITIATION';
    case 'pfmp_seconde':
      return 'CONVENTION RELATIVE AUX PÉRIODES DE FORMATION EN MILIEU PROFESSIONNEL - SECONDE';
    case 'pfmp_premiere_terminale':
      return 'CONVENTION RELATIVE AUX PÉRIODES DE FORMATION EN MILIEU PROFESSIONNEL - 1ÈRE/TERMINALE';
    default:
      return 'CONVENTION DE STAGE';
  }
}

/**
 * Retourne le code du document selon le type
 */
export function getConventionCode(type: ConventionType): string {
  switch (type) {
    case 'stage_initiation':
      return 'SEN-ANSE-SI-03';
    case 'pfmp_seconde':
      return 'SEN-ANSE-REA-54';
    case 'pfmp_premiere_terminale':
      return 'SEN-ANSE-REA-25';
    default:
      return 'SEN-ANSE-XXX';
  }
}
