'use strict';

let prixOptionsActuelles = {};
let optionsActuelles = [];
let cart = [];
let cartCount = 0;

const menuItems = {
    'Lalo': {
        options: ['Petite portion', 'Grande portion'],
        prix: { 'Petite portion': 750, 'Grande portion': 1000 },
        image: 'images/Lalo.png'
    },
    'Crêpe salées': {
        options: ['Poulet', 'Jambon', 'Viande moulue'],
        prix: { 'Poulet': 500, 'Jambon': 600, 'Viande moulue': 600 },
        image: 'images/Crêpe Salées.jpg'
    },
    'Tonmtonm': {
        options: ['Simple', 'Boeuf', 'Porc'],
        prix: { 'Simple': 750, 'Boeuf': 750, 'Porc': 750 },
        image: 'images/Tonmtonm.webp'
    },
    'Paté': {
        options: ['Poulet', 'Viande moulue', 'Hareng', 'Morue', 'Au four'],
        prix: { 'Poulet': 250, 'Viande moulue': 300, 'Hareng': 250, 'Morue': 250, 'Au four': 300 },
        image: 'images/Paté.jpg'
    },
    'Ragoût': {
        options: ['Simple'],
        prix: { 'Simple': 750 },
        image: 'images/Ragoût.jpg'
    },
    'Wings': {
        options: ['Sauce barbecue', 'Simple'],
        prix: { 'Sauce barbecue': 1000, 'Simple': 750 },
        image: 'images/Wings.jpg'
    }
};
// Gestion du Menu Mobile
const menuToggle = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
}

function ajouterPlat(nom, options, mappingPrix, imagePath) {
    // Affichage de la modale
    document.getElementById('modalCommande').style.display = 'block';
    document.getElementById('step-form').style.display = 'block';
    document.getElementById('step-review').style.display = 'none';
    document.getElementById('step-success').style.display = 'none';
    
    // Initialisation des données de base
    document.getElementById('nomPlat').value = nom;
    document.getElementById('quantite').value = 1;
    
    // CRUCIAL : On stocke les prix et options pour que la fonction de calcul y ait accès
    prixOptionsActuelles = mappingPrix;
    optionsActuelles = options;

    // --- ICI : RÉINITIALISATION DU PRIX À L'OUVERTURE ---
    const zonePrix = document.getElementById('affichage-prix-dynamique');
    zonePrix.innerText = "Prix : 0 HTG"; // Remet le prix à zéro pour la nouvelle commande

    // Mise à jour de l'image
    const imgModale = document.getElementById('modal-img');
    if (imgModale) {
        imgModale.src = imagePath || ""; 
    }

    // Gestion de la liste déroulante
    const selectOption = document.getElementById('optionPlat');
    const containerVariante = document.getElementById('container-variante');
    
    selectOption.innerHTML = '<option value="" disabled selected>-- Choisir une option --</option>';

    if (options && options.length > 0) {
        containerVariante.style.display = 'block';
        options.forEach(opt => {
            let el = document.createElement("option");
            el.textContent = opt; 
            el.value = opt;
            selectOption.appendChild(el);
        });

        if (options.length === 1) {
            selectOption.value = options[0];
            mettreAJourPrix();
        }
    } else {
        containerVariante.style.display = 'none';
        const prixParDefaut = Object.values(prixOptionsActuelles)[0] || 0;
        if (prixParDefaut) {
            zonePrix.innerHTML = "Prix : " + prixParDefaut + " HTG";
        }
    }
}

function mettreAJourPrix() {
        const choix = document.getElementById('optionPlat')?.value || '';
        const qte = parseInt(document.getElementById('quantite')?.value) || 1;
        let prixUnit = 0;
        
        if (optionsActuelles && optionsActuelles.length > 0) {
            prixUnit = prixOptionsActuelles[choix] || 0;
        } else {
            prixUnit = Object.values(prixOptionsActuelles)[0] || 0;
        }

        const zonePrix = document.getElementById('affichage-prix-dynamique');
        if (zonePrix) {
            if (prixUnit > 0) {
                const total = prixUnit * qte;
                zonePrix.innerHTML = "Prix : " + total + " HTG";
            } else {
                zonePrix.innerText = "";
            }
        }
}

// Écouteurs pour le changement d'option et de quantité
const optionPlatEl = document.getElementById('optionPlat');
const quantiteEl = document.getElementById('quantite');
if (optionPlatEl) optionPlatEl.addEventListener('change', mettreAJourPrix);
if (quantiteEl) quantiteEl.addEventListener('input', mettreAJourPrix);

function passerAuReview() {
    const optionChoisie = document.getElementById('optionPlat').value;
    const fraisLivraison = 500; // Frais de livraison
    
    // Sécurité : on vérifie que l'option est choisie avant de passer à la suite
    if (optionsActuelles.length > 0 && !optionChoisie) {
        alert("Veuillez choisir une option avant de continuer.");
        return;
    }

    const nom = document.getElementById('nomPlat').value;
    const qte = document.getElementById('quantite').value;
    const prixUnit = optionsActuelles.length > 0 ? prixOptionsActuelles[optionChoisie] : Object.values(prixOptionsActuelles)[0];
    const sousTotal = prixUnit * qte;
    const total = sousTotal + fraisLivraison;

    document.getElementById('review-details').innerHTML = `
    <div style="text-align: left; padding: 10px;">
        <p><strong>Plat :</strong> ${nom}</p>
        <p><strong>Option :</strong> ${optionChoisie || 'Standard'}</p>
        <p><strong>Quantité :</strong> ${qte}</p>
        <hr style="border: 0.5px solid #eee;">
        <p>Sous-total : ${sousTotal} HTG</p>
        <p>Frais de livraison : ${fraisLivraison} HTG</p>
        <p style="font-size: 1.2rem; color: #2e8b57; margin-top: 10px;">
            <strong>Total à payer : ${total} HTG</strong>
        </p>
    </div>

    `;

    document.getElementById('step-form').style.display = 'none';
    document.getElementById('step-review').style.display = 'block';
}

function fermerModale() {
    // Cache la modale
    document.getElementById('modalCommande').style.display = 'none';
    
    // Réinitialise l'affichage pour que la prochaine ouverture reparte du formulaire
    document.getElementById('step-form').style.display = 'block';
    document.getElementById('step-review').style.display = 'none';
    document.getElementById('step-success').style.display = 'none';
    
    // Réinitialise la quantité
    document.getElementById('quantite').value = 1;
}

function retourFormulaire() {
    document.getElementById('step-review').style.display = 'none';
    document.getElementById('step-form').style.display = 'block';
}

function validerCommande() {
    const nom = document.getElementById('nomPlat').value;
    const qte = document.getElementById('quantite').value;
    const option = document.getElementById('optionPlat').value || "Standard";
    
    // On récupère le texte du résumé (qui contient le total et les frais)
    const details = document.getElementById('review-details').innerText;

    // Affichage du message de succès sur le site
    document.getElementById('step-review').style.display = 'none';
    document.getElementById('step-success').style.display = 'block';
}

// Script pour faire défiler le carrousel d'accueil avec la molette de la souris
const carousel = document.querySelector('.hero-carousel');

if (carousel) {
    carousel.addEventListener('wheel', (evt) => {
        evt.preventDefault(); // Empêche la page de descendre
        carousel.scrollLeft += evt.deltaY; // Transforme le mouvement vertical en horizontal
    });
}

function scrollCarousel(direction) {
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        const scrollAmount = carousel.clientWidth;
        carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
}

function prevSlide() {
    scrollCarousel(-1);
}

function nextSlide() {
    scrollCarousel(1);
}

function ouvrirContact() {
    // Numéro de téléphone
    const tel = "50946259332"; 
    const message = "Bonjour Momo's, je souhaiterais passer une commande ou avoir des informations.";

    // Crétion du lien whatsapp
    const whatsappUrl = `https://wa.me/${tel}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    const carousel = document.querySelector('.hero-carousel');
let scrollInterval;

// Fonction qui fait avancer le carrousel
function startAutoScroll() {
    scrollInterval = setInterval(() => {
        // Si on arrive à la fin, on revient au début
        if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            // Sinon on avance d'une image (la largeur du conteneur)
            carousel.scrollBy({ left: carousel.offsetWidth, behavior: 'smooth' });
        }
    }, 2000); // Change d'image toutes les 2 secondes
}

// Arrête le défilement
function stopAutoScroll() {
    clearInterval(scrollInterval);
}

// Événements : quand la souris entre ou sort de l'image
carousel.addEventListener('mouseenter', startAutoScroll);
carousel.addEventListener('mouseleave', stopAutoScroll);
}

function ouvrirMap() {
    const map = document.getElementById('map-container');
    
    if (map.style.display === 'none' || map.style.display === '') {
        map.style.display = 'block';
        // Petit délai pour laisser le temps à l'affichage avant de scroller
        setTimeout(() => {
            map.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    } else {
        map.style.display = 'none';
    }
}

function ajouterAuPanier(nom) {
    const itemDetails = menuItems[nom] || { options: [], prix: {}, image: '' };
    cart.push({ nom, ...itemDetails });
    cartCount = cart.length;
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = cartCount;
    }
    alert(`${nom} ajouté au panier.`);
}

function ouvrirPanier() {
    if (cart.length === 0) {
        alert('Votre panier est vide.');
    } else {
        let message = 'Votre panier :\n';
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.nom}\n`;
        });
        if (confirm(message + '\n\nVoulez-vous finaliser la commande ?')) {
            const item = cart[0];
            if (item) {
                ajouterPlat(item.nom, item.options, item.prix, item.image);
                if (item.options && item.options.length > 1) {
                    const selectOption = document.getElementById('optionPlat');
                    if (selectOption) {
                        selectOption.value = item.options[0];
                        mettreAJourPrix();
                    }
                }
            } else {
                document.getElementById('modalCommande').style.display = 'block';
                document.getElementById('step-form').style.display = 'block';
                document.getElementById('step-review').style.display = 'none';
                document.getElementById('step-success').style.display = 'none';
            }
        }
    }
}

const modalCommande = document.getElementById('modalCommande');
if (modalCommande) {
    modalCommande.addEventListener('click', (evt) => {
        if (evt.target === modalCommande) {
            fermerModale();
        }
    });
}
