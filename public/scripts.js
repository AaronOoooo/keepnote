document.addEventListener('DOMContentLoaded', () => {
    let offset = 10;
    const loadMoreButton = document.getElementById('load-more');

    loadMoreButton.addEventListener('click', () => {
        fetch(`/load_more/${offset}`)
            .then(response => response.json())
            .then(notes => {
                const notesContainer = document.getElementById('notes');
                notes.forEach(note => {
                    const noteElement = document.createElement('div');
                    noteElement.classList.add('note');
                    noteElement.dataset.id = note.id;

                    const noteContent = document.createElement('div');
                    noteContent.classList.add('note-content');
                    noteContent.textContent = note.content;

                    const noteFooter = document.createElement('div');
                    noteFooter.classList.add('note-footer');

                    const date = new Date(note.created_at).toLocaleString('en-US', { hour12: true });
                    const dateSpan = document.createElement('span');
                    dateSpan.textContent = date;

                    const editButton = document.createElement('button');
                    editButton.classList.add('edit-note');
                    editButton.textContent = 'Edit';

                    const moveTopButton = document.createElement('button');
                    moveTopButton.classList.add('move-top');
                    moveTopButton.textContent = 'Move to Top';

                    noteFooter.appendChild(dateSpan);
                    noteFooter.appendChild(editButton);
                    noteFooter.appendChild(moveTopButton);

                    noteElement.appendChild(noteContent);
                    noteElement.appendChild(noteFooter);

                    notesContainer.appendChild(noteElement);
                });

                offset += 10;
            });
    });

    document.getElementById('notes').addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-note')) {
            const noteElement = event.target.closest('.note');
            const noteContent = noteElement.querySelector('.note-content');
            const newContent = prompt('Edit your note:', noteContent.textContent);
            if (newContent !== null) {
                const id = noteElement.dataset.id;
                fetch(`/update/${id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: newContent })
                }).then(() => {
                    noteContent.textContent = newContent;
                });
            }
        }

        if (event.target.classList.contains('move-top')) {
            const noteElement = event.target.closest('.note');
            const notesContainer = document.getElementById('notes');
            notesContainer.insertBefore(noteElement, notesContainer.firstChild);
        }
    });
});
