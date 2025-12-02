/*
  # Add new convention fields

  1. New Columns
    - `diplome_prepare` (text) - Diploma being prepared (e.g., "Bac Pro CGEA", "DNB")
    - `domaine_professionnel` (text) - Professional domain (e.g., "Agriculture", "Espaces verts")
    - `annee_scolaire` (text) - School year (e.g., "2025/2026")
    
    - `qualite_representant` (text) - Quality/title of company representative
    - `lieu_stage_si_different` (text) - Alternative internship location if different
    
    - `enseignant_referent_nom` (text) - Reference teacher last name
    - `enseignant_referent_prenom` (text) - Reference teacher first name
    - `enseignant_referent_fonction` (text) - Reference teacher function/discipline
    - `enseignant_referent_email` (text) - Reference teacher email
    
    - `tuteur_entreprise_nom` (text) - Company tutor last name
    - `tuteur_entreprise_prenom` (text) - Company tutor first name
    - `tuteur_entreprise_fonction` (text) - Company tutor function
    - `tuteur_entreprise_telephone` (text) - Company tutor phone
    - `tuteur_entreprise_email` (text) - Company tutor email
    
    - `horaires_lundi` (text) - Monday schedule
    - `horaires_mardi` (text) - Tuesday schedule
    - `horaires_mercredi` (text) - Wednesday schedule
    - `horaires_jeudi` (text) - Thursday schedule
    - `horaires_vendredi` (text) - Friday schedule
    - `horaires_samedi` (text) - Saturday schedule
    - `duree_hebdomadaire` (integer) - Weekly hours
    
    - `principales_taches` (text) - Main tasks assigned to intern

  2. Notes
    - All fields are optional to maintain backward compatibility
    - These fields complete the information needed for official PDF templates
*/

DO $$
BEGIN
  -- General information
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'diplome_prepare'
  ) THEN
    ALTER TABLE conventions ADD COLUMN diplome_prepare TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'domaine_professionnel'
  ) THEN
    ALTER TABLE conventions ADD COLUMN domaine_professionnel TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'annee_scolaire'
  ) THEN
    ALTER TABLE conventions ADD COLUMN annee_scolaire TEXT;
  END IF;

  -- Company additional fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'qualite_representant'
  ) THEN
    ALTER TABLE conventions ADD COLUMN qualite_representant TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'lieu_stage_si_different'
  ) THEN
    ALTER TABLE conventions ADD COLUMN lieu_stage_si_different TEXT;
  END IF;

  -- Reference teacher fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'enseignant_referent_nom'
  ) THEN
    ALTER TABLE conventions ADD COLUMN enseignant_referent_nom TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'enseignant_referent_prenom'
  ) THEN
    ALTER TABLE conventions ADD COLUMN enseignant_referent_prenom TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'enseignant_referent_fonction'
  ) THEN
    ALTER TABLE conventions ADD COLUMN enseignant_referent_fonction TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'enseignant_referent_email'
  ) THEN
    ALTER TABLE conventions ADD COLUMN enseignant_referent_email TEXT;
  END IF;

  -- Company tutor fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'tuteur_entreprise_nom'
  ) THEN
    ALTER TABLE conventions ADD COLUMN tuteur_entreprise_nom TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'tuteur_entreprise_prenom'
  ) THEN
    ALTER TABLE conventions ADD COLUMN tuteur_entreprise_prenom TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'tuteur_entreprise_fonction'
  ) THEN
    ALTER TABLE conventions ADD COLUMN tuteur_entreprise_fonction TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'tuteur_entreprise_telephone'
  ) THEN
    ALTER TABLE conventions ADD COLUMN tuteur_entreprise_telephone TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'tuteur_entreprise_email'
  ) THEN
    ALTER TABLE conventions ADD COLUMN tuteur_entreprise_email TEXT;
  END IF;

  -- Schedule fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'horaires_lundi'
  ) THEN
    ALTER TABLE conventions ADD COLUMN horaires_lundi TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'horaires_mardi'
  ) THEN
    ALTER TABLE conventions ADD COLUMN horaires_mardi TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'horaires_mercredi'
  ) THEN
    ALTER TABLE conventions ADD COLUMN horaires_mercredi TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'horaires_jeudi'
  ) THEN
    ALTER TABLE conventions ADD COLUMN horaires_jeudi TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'horaires_vendredi'
  ) THEN
    ALTER TABLE conventions ADD COLUMN horaires_vendredi TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'horaires_samedi'
  ) THEN
    ALTER TABLE conventions ADD COLUMN horaires_samedi TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'duree_hebdomadaire'
  ) THEN
    ALTER TABLE conventions ADD COLUMN duree_hebdomadaire INTEGER;
  END IF;

  -- Main tasks
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'principales_taches'
  ) THEN
    ALTER TABLE conventions ADD COLUMN principales_taches TEXT;
  END IF;
END $$;
