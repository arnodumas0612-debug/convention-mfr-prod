/*
  # Ajout du champ convention_type
  
  ## Modifications
  
  1. Ajout du champ convention_type dans la table conventions
    - Type ENUM avec 3 valeurs: 'stage_initiation', 'pfmp_seconde', 'pfmp_premiere_terminale'
    - Permet de différencier les 3 types de conventions
  
  ## Notes
  - Le champ est calculé automatiquement selon la classe de l'élève
*/

-- Ajouter le champ convention_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conventions' AND column_name = 'convention_type'
  ) THEN
    ALTER TABLE conventions 
    ADD COLUMN convention_type TEXT CHECK (convention_type IN ('stage_initiation', 'pfmp_seconde', 'pfmp_premiere_terminale'));
  END IF;
END $$;
