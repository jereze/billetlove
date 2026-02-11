export default defineContentScript({
  matches: ['https://www.billetweb.fr/bo/*'],
  main() {
    console.log('[BilletLove] Content script chargé');

    /**
     * Trouve et traite tous les liens vers des fichiers uploadés
     */
    function processImageLinks() {
      // Trouve tous les liens contenant "/file.php?user_files"
      const links = document.querySelectorAll<HTMLAnchorElement>(
        'a[href*="/file.php?user_files"]'
      );

      links.forEach((link) => {
        // Vérifie si l'image n'a pas déjà été ajoutée
        if (link.dataset.billetloveProcessed === 'true') {
          return;
        }

        // Marque le lien comme traité
        link.dataset.billetloveProcessed = 'true';

        // Crée un conteneur pour l'image
        const imageContainer = document.createElement('div');
        imageContainer.style.marginTop = '10px';
        imageContainer.style.marginBottom = '10px';

        // Crée l'élément image
        const img = document.createElement('img');
        img.src = link.href;
        img.alt = link.textContent || 'Image';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '400px';
        img.style.border = '1px solid #ddd';
        img.style.borderRadius = '4px';
        img.style.cursor = 'pointer';

        // Permet de cliquer sur l'image pour l'ouvrir en grand
        img.addEventListener('click', () => {
          window.open(link.href, '_blank');
        });

        // Gestion du chargement et des erreurs
        img.addEventListener('load', () => {
          console.log('[BilletLove] Image chargée:', link.href);
        });

        img.addEventListener('error', () => {
          console.error('[BilletLove] Erreur de chargement:', link.href);
          imageContainer.innerHTML =
            '<em style="color: #999;">Impossible de charger l\'image</em>';
        });

        imageContainer.appendChild(img);

        // Insère l'image après le label parent
        const labelParent = link.closest('.label_data');
        if (labelParent && labelParent.parentNode) {
          labelParent.parentNode.insertBefore(
            imageContainer,
            labelParent.nextSibling
          );
        } else {
          // Si pas de label_data, insère directement après le lien
          link.parentNode?.insertBefore(imageContainer, link.nextSibling);
        }
      });
    }

    // Traite les liens déjà présents dans la page
    processImageLinks();

    // Observe les modifications du DOM pour détecter le contenu chargé en AJAX
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;

      for (const mutation of mutations) {
        // Vérifie si de nouveaux nœuds ont été ajoutés
        if (mutation.addedNodes.length > 0) {
          shouldProcess = true;
          break;
        }
      }

      if (shouldProcess) {
        processImageLinks();
      }
    });

    // Commence à observer le document
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log('[BilletLove] Observer activé pour le chargement dynamique');
  },
});
