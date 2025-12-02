/*
  # Ajouter les politiques de suppression

  ## Modifications
  
  1. Politiques de suppression
    - Permettre suppression des conventions
    - Permettre suppression des périodes de stage
    - Permettre suppression des signatures
  
  ## Sécurité
  - RLS reste activé
  - Accès public pour permettre la suppression depuis le dashboard
*/

-- Politiques de suppression pour conventions
DROP POLICY IF EXISTS "Anyone can delete conventions" ON conventions;

CREATE POLICY "Anyone can delete conventions"
  ON conventions FOR DELETE
  TO public
  USING (true);

-- Politiques de suppression pour stage_periods
DROP POLICY IF EXISTS "Anyone can delete stage periods" ON stage_periods;

CREATE POLICY "Anyone can delete stage periods"
  ON stage_periods FOR DELETE
  TO public
  USING (true);

-- Politiques de suppression pour signatures
DROP POLICY IF EXISTS "Anyone can delete signatures" ON signatures;

CREATE POLICY "Anyone can delete signatures"
  ON signatures FOR DELETE
  TO public
  USING (true);
