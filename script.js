document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('restoran-form');
    const restoraniList = document.getElementById('restorani-list');

    const apiUrl = 'http://localhost:3000/restorani';

    // Dohvaćanje svih restorana
    const fetchRestorani = async () => {
        try {
            const response = await fetch(apiUrl);
            const restorani = await response.json();
            renderRestorani(restorani);
        } catch (error) {
            console.error('Error fetching restorani:', error);
        }
    };

    // Prikazivanje restorana
    const renderRestorani = (restorani) => {
        restoraniList.innerHTML = '';
        restorani.forEach(restoran => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${restoran.naziv}</strong><br>
                Adresa: ${restoran.adresa}<br>
                Telefon: ${restoran.telefon}<br>
                Vrsta: ${restoran.vrsta}
                <div class="actions">
                    <button class="edit" data-id="${restoran._id}">Uredi</button>
                    <button class="delete" data-id="${restoran._id}">Obriši</button>
                </div>
            `;
            restoraniList.appendChild(li);
        });
    };

    // Dodavanje novog restorana
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const newRestoran = await response.json();
            fetchRestorani();
        } catch (error) {
            console.error('Error adding restoran:', error);
        }
        form.reset();
    });

    // Brisanje restorana
    restoraniList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete')) {
            const id = e.target.dataset.id;
            try {
                await fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE',
                });
                fetchRestorani();
            } catch (error) {
                console.error('Error deleting restoran:', error);
            }
        }

        // Ažuriranje restorana (pojednostavljeno)
        if (e.target.classList.contains('edit')) {
            const id = e.target.dataset.id;
            const restoranElement = e.target.parentElement.parentElement;
            const naziv = prompt('Unesi novi naziv:', restoranElement.querySelector('strong').innerText);
            const adresa = prompt('Unesi novu adresu:', restoranElement.querySelector('br + br').nextSibling.nodeValue.trim());
            const telefon = prompt('Unesi novi telefon:', restoranElement.querySelector('br + br + br').nextSibling.nodeValue.trim());
            const vrsta = prompt('Unesi novu vrstu:', restoranElement.querySelector('br + br + br + br').nextSibling.nodeValue.trim());

            try {
                await fetch(`${apiUrl}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ naziv, adresa, telefon, vrsta }),
                });
                fetchRestorani();
            } catch (error) {
                console.error('Error updating restoran:', error);
            }
        }
    });

    // Inicijalno dohvaćanje restorana
    fetchRestorani();
});

