<!DOCTYPE html>
<html>
<head>
    <title>Traitement de votre réclamation</title>
</head>
<body>
    <h1>Bonjour {{ $reclamation->etudiant->prenom }} {{ $reclamation->etudiant->nom }},</h1>
    
    <p>Votre réclamation concernant la matière <strong>{{ $reclamation->matiere->nom_matiere }}</strong> ({{ $reclamation->matiere->code_matiere }}) a été traitée.</p>
    
    <p><strong>Statut final :</strong> {{ $reclamation->status }}</p>
    
    <h3>Message de la scolarité :</h3>
    <p>{{ $reclamation->commentaire_scolarite ?? 'Aucun commentaire.' }}</p>

    @if($reclamation->note_corrigee)
        <p><strong>Votre note a été corrigée : {{ $reclamation->note_corrigee }}</strong></p>
    @endif

    <p>Vous pouvez consulter les détails complets en vous connectant à votre espace.</p>
    
    <p>Cordialement,<br>
    L'équipe Scolarité IBAM</p>
</body>
</html>
