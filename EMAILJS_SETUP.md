# Configuration EmailJS pour le formulaire de contact

## 1. Créer un compte EmailJS

1. Aller sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créer un compte gratuit (200 emails/mois)
3. Vérifier votre email

## 2. Ajouter un service d'email

1. Dans le dashboard EmailJS, aller dans **Email Services**
2. Cliquer sur **Add New Service**
3. Choisir votre fournisseur d'email :
   - Gmail (recommandé)
   - Outlook
   - Yahoo
   - Ou autre
4. Suivre les instructions pour connecter votre compte
5. **Copier le Service ID** (ex: `service_abc1234`)

## 3. Créer un template d'email

1. Aller dans **Email Templates**
2. Cliquer sur **Create New Template**
3. Utiliser ce contenu pour le template :

### Sujet de l'email :

```
Nouveau message de {{from_name}} - {{subject}}
```

### Corps de l'email :

```
Vous avez reçu un nouveau message depuis votre portfolio !

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 INFORMATIONS DE CONTACT

Prénom : {{prenom}}
Nom : {{nom}}
Email : {{from_email}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 SUJET

{{subject}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 MESSAGE

{{message}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Envoyé depuis votre portfolio
```

4. **Copier le Template ID** (ex: `template_xyz5678`)

## 4. Récupérer votre clé publique

1. Aller dans **Account** > **General**
2. Copier votre **Public Key** (ex: `abcdefghijklmnop`)

## 5. Configuration dans le projet

1. Créer un fichier `.env` à la racine du projet :

```env
PUBLIC_EMAILJS_SERVICE_ID=service_abc1234
PUBLIC_EMAILJS_TEMPLATE_ID=template_xyz5678
PUBLIC_EMAILJS_PUBLIC_KEY=abcdefghijklmnop
```

2. Remplacer les valeurs par vos vraies clés EmailJS

## 6. Tester le formulaire

1. Relancer le serveur de dev : `npm run dev`
2. Ouvrir l'overlay Contact
3. Remplir et envoyer le formulaire
4. Vérifier que :
   - Le bouton affiche "ENVOI EN COURS..."
   - Puis "✓ MESSAGE ENVOYÉ !"
   - Le formulaire se réinitialise
   - Vous recevez l'email dans votre boîte mail

## 📋 Checklist finale

- [ ] Compte EmailJS créé et vérifié
- [ ] Service d'email connecté (Gmail/Outlook/etc.)
- [ ] Template d'email créé avec les bons paramètres
- [ ] Fichier `.env` créé avec les 3 clés
- [ ] Serveur relancé
- [ ] Test du formulaire réussi
- [ ] Email reçu dans la boîte mail

## ⚠️ Important

- Ne **jamais** commit le fichier `.env` (déjà dans `.gitignore`)
- Pour la production, ajouter les variables d'environnement dans votre plateforme de déploiement (Vercel, Netlify, etc.)
- Limites du plan gratuit : 200 emails/mois

## 🔧 Dépannage

### "EmailJS non configuré"

→ Vérifier que le fichier `.env` existe et contient les 3 variables

### "ERREUR D'ENVOI"

→ Vérifier que :

- Les clés sont correctes
- Le service d'email est bien connecté
- Le template existe
- Vous n'avez pas dépassé la limite mensuelle

### Email non reçu

→ Vérifier les spams et le dossier "Promotions" (Gmail)
