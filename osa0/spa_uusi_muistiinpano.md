sequenceDiagram
    participant browser
    participant server
        
    note right of browser: user writes a note and clicks 'Save'
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser:  201 Created
    deactivate server
    
    note right of browser: console informs that note has been created
    note right of browser: new note is in the list of notes