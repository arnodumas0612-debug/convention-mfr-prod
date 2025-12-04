IMPORTANT - Remplacer les fichiers dummy avant déploiement

Les 3 fichiers .docx actuels (20 bytes) sont des DUMMY.
Avant de déployer sur GitHub/Netlify, remplacez-les par les vrais templates :

- CONVENTION_4eme_3eme_FINAL.docx (environ 65 KB)
- CONVENTION_2nd_FINAL.docx (environ 73 KB)
- CONVENTION_1ère_TERM_FINAL.docx (environ 75 KB)

Ces fichiers contiennent les placeholders {{...}} et seront remplis automatiquement par docxService.ts

Instructions de remplacement :
1. Téléchargez les 3 vrais fichiers .docx
2. Supprimez les fichiers dummy actuels dans public/templates/
3. Copiez les vrais fichiers dans public/templates/
4. Vérifiez que les noms correspondent exactement (y compris les accents)
5. Commitez et poussez les changements

Les fichiers doivent contenir les placeholders suivants :
- {{nomJeune}}, {{prenomJeune}}, {{dateNaissance}}
- {{adresseJeune}}, {{cpJeune}}, {{villeJeune}}
- {{nomResponsableLegal}}, {{prenomResponsableLegal}}
- {{raisonSocialeEntreprise}}, {{adresseEntreprise}}
- {{nomTuteur}}, {{prenomTuteur}}, {{telephoneTuteur}}
- {{dateDebut}}, {{dateFin}}
- {{activitesPrincipales}}
- etc.
