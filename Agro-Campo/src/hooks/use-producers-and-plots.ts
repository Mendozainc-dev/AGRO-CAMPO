import { FirebaseError } from 'firebase/app';
import { useEffect, useState } from 'react';

import { readProducersAndPlots, type ProducerWithPlots } from '@/services/producers-and-plots';

type CatalogState =
  | { status: 'loading' }
  | { status: 'ready'; producers: ProducerWithPlots[] }
  | { status: 'error'; message: string };

function readError(error: unknown) {
  if (error instanceof FirebaseError) {
    if (error.code === 'permission-denied') {
      return 'Firestore no permitió leer productores y parcelas con esta cuenta.';
    }
    return 'No se pudo cargar el padrón. Revisa tu conexión e inténtalo de nuevo.';
  }

  return error instanceof Error ? error.message : 'No se pudo cargar el padrón.';
}

export function useProducersAndPlots() {
  const [state, setState] = useState<CatalogState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    readProducersAndPlots().then(
      (producers) => {
        if (active) setState({ status: 'ready', producers });
      },
      (error: unknown) => {
        if (active) setState({ status: 'error', message: readError(error) });
      },
    );

    return () => { active = false; };
  }, [attempt]);

  const refresh = () => {
    setState({ status: 'loading' });
    setAttempt((current) => current + 1);
  };

  return { state, refresh };
}
