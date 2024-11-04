import React from 'react';
import { Link } from 'react-router-dom';

export default function ErrorPage(){
    return (
        <div>
          <h1>Pagina non trovata</h1>
          <p>Oops! La pagina che stai cercando non esiste.</p>
          <Link to="/">Torna alla home</Link>
        </div>
      );
}