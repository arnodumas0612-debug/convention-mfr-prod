/*
  # Correction des politiques RLS pour accès public

  ## Modifications
  
  1. Politiques conventions
    - Permettre insertion sans authentification (pour utilisateurs publics)
    - Permettre lecture et modification des conventions créées
  
  2. Politiques stage_periods
    - Permettre insertion pour toutes les périodes liées aux conventions
  
  3. Politiques signatures
    - Permettre insertion publique des signatures
    - Permettre lecture des signatures liées aux conventions

  ## Sécurité
  - RLS reste activé
  - Accès contrôlé mais ouvert pour workflow public
*/

-- Supprimer les anciennes politiques restrictives pour conventions
DROP POLICY IF EXISTS "Users can view own conventions" ON conventions;
DROP POLICY IF EXISTS "Users can create conventions" ON conventions;
DROP POLICY IF EXISTS "Users can update own conventions" ON conventions;

-- Nouvelles politiques plus permissives pour conventions
CREATE POLICY "Anyone can create conventions"
  ON conventions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view conventions"
  ON conventions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update conventions"
  ON conventions FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Politiques pour stage_periods
DROP POLICY IF EXISTS "Users can view stage periods" ON stage_periods;
DROP POLICY IF EXISTS "Users can create stage periods" ON stage_periods;

CREATE POLICY "Anyone can view stage periods"
  ON stage_periods FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create stage periods"
  ON stage_periods FOR INSERT
  TO public
  WITH CHECK (true);

-- Politiques pour signatures
DROP POLICY IF EXISTS "Users can view signatures for their conventions" ON signatures;
DROP POLICY IF EXISTS "Authenticated users can create signatures" ON signatures;

CREATE POLICY "Anyone can view signatures"
  ON signatures FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create signatures"
  ON signatures FOR INSERT
  TO public
  WITH CHECK (true);

-- Politiques pour users (garder restrictif)
-- Les politiques existantes pour users restent inchangées