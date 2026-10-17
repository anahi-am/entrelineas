import type { EvidenceItem, PromiseRecord } from '../../domain/types';

/**
 * DEMO DATA ONLY.
 * Every party, promise, document and URL below is fictional. URLs use the
 * reserved example.org domain. Nothing here describes a real political claim.
 *
 * Rows mimic what a review backend may hold: evidence carries an `approved`
 * flag. The mock repository strips anything not approved, exactly as the public
 * API is expected to do.
 */
export type MockEvidenceRow = EvidenceItem & { approved: boolean };
export type MockPromiseRow = Omit<PromiseRecord, 'evidence'> & {
  evidence: MockEvidenceRow[];
};

const allMockPromiseRows: MockPromiseRow[] = [
  {
    id: 'demo-vivienda-001',
    originalText:
      'Construiremos 2.000 viviendas de alquiler asequible en el municipio durante la legislatura.',
    party: { name: 'Alianza Ejemplo' },
    topic: 'housing',
    territory: 'Municipio de Ejemplo',
    plainLanguageExplanation:
      'El partido dijo que se construirían 2.000 viviendas de alquiler asequible. Hay un plan aprobado de forma inicial y una licitación de primera fase, pero todavía no consta ninguna vivienda terminada ni cuántas viviendas incluirá cada fase.',
    officialSource: {
      title: 'Programa electoral (documento de ejemplo)',
      publisher: 'Alianza Ejemplo',
      url: 'https://example.org/demo/programa-alianza-ejemplo',
      publishedAt: '2023-05-01',
    },
    status: 'in_progress',
    evidence: [
      {
        id: 'ev-viv-001-a',
        kind: 'official_document',
        date: '2025-03-10',
        title: 'Aprobación inicial del plan municipal de vivienda',
        summary:
          'Se aprueba de forma inicial un plan que reserva suelo para vivienda de alquiler asequible. El documento no fija una cifra definitiva de viviendas.',
        originalExcerpt: 'Se aprueba inicialmente el Plan de Vivienda de Ejemplo.',
        source: {
          title: 'Acuerdo de aprobación inicial (documento de ejemplo)',
          publisher: 'Ayuntamiento de Ejemplo',
          url: 'https://example.org/demo/acuerdo-plan-vivienda',
          publishedAt: '2025-03-10',
        },
        approved: true,
      },
      {
        id: 'ev-viv-001-b',
        kind: 'official_record',
        date: '2025-09-02',
        title: 'Publicación de la licitación de la primera fase',
        summary:
          'Se publica la licitación de una primera fase de obras. El registro de ejemplo no detalla el número total de viviendas.',
        source: {
          title: 'Anuncio de licitación (registro de ejemplo)',
          publisher: 'Plataforma de contratación de Ejemplo',
          url: 'https://example.org/demo/licitacion-fase-1',
          publishedAt: '2025-09-02',
        },
        approved: true,
      },
      {
        id: 'ev-viv-001-c',
        kind: 'independent_report',
        date: '2025-10-01',
        title: 'Informe externo pendiente de revisión',
        summary: 'Esta prueba aún no ha sido aprobada y no debe mostrarse.',
        source: {
          title: 'Informe de ejemplo sin aprobar',
          publisher: 'Entidad de Ejemplo',
          url: 'https://example.org/demo/informe-sin-aprobar',
        },
        approved: false,
      },
    ],
    unverifiedNotes: [
      'No hay evidencia aprobada de cuántas viviendas incluirá cada fase.',
      'No consta fecha de entrega de ninguna vivienda.',
      'No se ha verificado cómo definen «asequible» los documentos.',
    ],
    lastUpdatedAt: '2026-09-30',
  },
  {
    id: 'demo-vivienda-002',
    originalText:
      'Limitaremos las subidas del alquiler en las zonas tensionadas de la comunidad.',
    party: { name: 'Unión Muestra' },
    topic: 'housing',
    territory: 'Comunidad de Ejemplo',
    plainLanguageExplanation:
      'El partido prometió limitar las subidas del alquiler en ciertas zonas. La norma se presentó, pero un recurso ha suspendido su aplicación mientras no se resuelva.',
    officialSource: {
      title: 'Programa electoral (documento de ejemplo)',
      publisher: 'Unión Muestra',
      url: 'https://example.org/demo/programa-union-muestra',
      publishedAt: '2023-05-02',
    },
    status: 'blocked',
    evidence: [
      {
        id: 'ev-viv-002-a',
        kind: 'official_document',
        date: '2025-01-20',
        title: 'Presentación del proyecto de ley',
        summary:
          'Se presenta en el parlamento autonómico un proyecto de ley sobre contención de alquileres.',
        source: {
          title: 'Proyecto de ley (documento de ejemplo)',
          publisher: 'Parlamento de la Comunidad de Ejemplo',
          url: 'https://example.org/demo/proyecto-ley-alquileres',
          publishedAt: '2025-01-20',
        },
        approved: true,
      },
      {
        id: 'ev-viv-002-b',
        kind: 'official_record',
        date: '2025-06-12',
        title: 'Suspensión cautelar de su aplicación',
        summary:
          'Un recurso ante un tribunal suspende de forma cautelar la aplicación de la norma.',
        originalExcerpt: 'Se acuerda la suspensión cautelar de la norma recurrida.',
        source: {
          title: 'Resolución judicial (registro de ejemplo)',
          publisher: 'Tribunal de Ejemplo',
          url: 'https://example.org/demo/suspension-cautelar',
          publishedAt: '2025-06-12',
        },
        approved: true,
      },
    ],
    unverifiedNotes: [
      'No hay evidencia aprobada de cuándo se resolverá el recurso.',
      'No se ha verificado cuántas zonas serían declaradas tensionadas.',
    ],
    lastUpdatedAt: '2026-09-18',
  },
  {
    id: 'demo-vivienda-003',
    originalText: 'Pondremos en marcha un registro público de viviendas vacías.',
    party: { name: 'Coalición de Prueba' },
    topic: 'housing',
    territory: 'Ámbito estatal de ejemplo',
    plainLanguageExplanation:
      'El partido anunció la creación de un registro de viviendas vacías. Por ahora no hay evidencia aprobada de que se haya hecho ninguna gestión oficial al respecto.',
    officialSource: {
      title: 'Programa electoral (documento de ejemplo)',
      publisher: 'Coalición de Prueba',
      url: 'https://example.org/demo/programa-coalicion-prueba',
      publishedAt: '2023-05-03',
    },
    status: 'no_trace',
    evidence: [],
    unverifiedNotes: [
      'No hay evidencia aprobada de ninguna acción oficial sobre este registro.',
      '«Sin rastro» no prueba que no exista actividad: puede haberla sin documentar o sin revisar.',
    ],
    lastUpdatedAt: '2026-08-05',
  },
  {
    id: 'demo-pensiones-001',
    originalText: 'Revalorizaremos las pensiones cada año conforme al IPC.',
    party: { name: 'Alianza Ejemplo' },
    topic: 'pensions',
    territory: 'Ámbito estatal de ejemplo',
    plainLanguageExplanation:
      'El partido prometió subir las pensiones cada año según la inflación. Hay una norma de revalorización y constancia de su aplicación en un ejercicio.',
    officialSource: {
      title: 'Programa electoral (documento de ejemplo)',
      publisher: 'Alianza Ejemplo',
      url: 'https://example.org/demo/programa-alianza-ejemplo',
      publishedAt: '2023-05-01',
    },
    status: 'done',
    evidence: [
      {
        id: 'ev-pen-001-a',
        kind: 'official_document',
        date: '2025-01-05',
        title: 'Norma de revalorización anual',
        summary: 'Una norma fija la revalorización anual de las pensiones en función del IPC.',
        originalExcerpt: 'Las pensiones se revalorizarán anualmente conforme al IPC.',
        source: {
          title: 'Norma de revalorización (documento de ejemplo)',
          publisher: 'Boletín oficial de Ejemplo',
          url: 'https://example.org/demo/norma-revalorizacion',
          publishedAt: '2025-01-05',
        },
        approved: true,
      },
      {
        id: 'ev-pen-001-b',
        kind: 'official_record',
        date: '2025-01-30',
        title: 'Aplicación de la subida en la nómina de enero',
        summary: 'El registro de ejemplo recoge la aplicación de la subida en la nómina de enero.',
        source: {
          title: 'Nota de nómina (registro de ejemplo)',
          publisher: 'Entidad gestora de Ejemplo',
          url: 'https://example.org/demo/nomina-enero',
          publishedAt: '2025-01-30',
        },
        approved: true,
      },
    ],
    unverifiedNotes: [
      'La evidencia cubre un solo ejercicio; no se ha verificado el cumplimiento en los siguientes.',
      'No se ha comprobado si el IPC aplicado coincide con el IPC interanual de cada año.',
    ],
    lastUpdatedAt: '2026-09-22',
  },
  {
    id: 'demo-pensiones-002',
    originalText: 'Garantizaremos una pensión mínima de 1.200 euros.',
    party: { name: 'Unión Muestra' },
    topic: 'pensions',
    territory: 'Ámbito estatal de ejemplo',
    plainLanguageExplanation:
      'El partido prometió una pensión mínima de 1.200 euros. Hay una declaración oficial sobre mejorar las pensiones mínimas, pero sin esa cifra, así que no se puede afirmar si la promesa se ha cumplido.',
    officialSource: {
      title: 'Programa electoral (documento de ejemplo)',
      publisher: 'Unión Muestra',
      url: 'https://example.org/demo/programa-union-muestra',
      publishedAt: '2023-05-02',
    },
    status: 'insufficient_evidence',
    evidence: [
      {
        id: 'ev-pen-002-a',
        kind: 'official_statement',
        date: '2025-04-08',
        title: 'Declaración institucional sobre pensiones mínimas',
        summary:
          'La declaración menciona un objetivo de mejora de las pensiones mínimas, sin indicar una cifra concreta.',
        originalExcerpt: 'Se trabajará en la mejora de las pensiones mínimas.',
        source: {
          title: 'Declaración institucional (documento de ejemplo)',
          publisher: 'Gobierno de Ejemplo',
          url: 'https://example.org/demo/declaracion-pensiones',
          publishedAt: '2025-04-08',
        },
        approved: true,
      },
    ],
    unverifiedNotes: [
      'No hay evidencia aprobada de una norma que fije los 1.200 euros.',
      'No se ha localizado una partida presupuestaria asociada.',
    ],
    lastUpdatedAt: '2026-09-10',
  },
  {
    id: 'demo-empleo-001',
    originalText:
      'Crearemos un programa de contratación para personas menores de 30 años.',
    party: { name: 'Coalición de Prueba' },
    topic: 'employment',
    territory: 'Comunidad de Ejemplo',
    plainLanguageExplanation:
      'El partido prometió un programa para contratar a personas jóvenes. Se ha publicado la convocatoria de ayudas, pero no consta cuántos contratos se han firmado.',
    officialSource: {
      title: 'Programa electoral (documento de ejemplo)',
      publisher: 'Coalición de Prueba',
      url: 'https://example.org/demo/programa-coalicion-prueba',
      publishedAt: '2023-05-03',
    },
    status: 'in_progress',
    evidence: [
      {
        id: 'ev-emp-001-a',
        kind: 'official_document',
        date: '2025-05-14',
        title: 'Convocatoria de ayudas a la contratación joven',
        summary:
          'Se publica la convocatoria de un programa de ayudas para contratar a personas menores de 30 años.',
        source: {
          title: 'Convocatoria (documento de ejemplo)',
          publisher: 'Consejería de Empleo de Ejemplo',
          url: 'https://example.org/demo/convocatoria-contratacion-joven',
          publishedAt: '2025-05-14',
        },
        approved: true,
      },
    ],
    unverifiedNotes: [
      'No hay evidencia aprobada del número de contratos firmados.',
      'No consta el presupuesto total asignado al programa.',
    ],
    lastUpdatedAt: '2026-09-12',
  },
  {
    id: 'demo-empleo-002',
    originalText:
      'Reduciremos a 15 días el plazo para tramitar las ayudas al empleo.',
    party: { name: 'Alianza Ejemplo' },
    topic: 'employment',
    territory: 'Municipio de Ejemplo',
    plainLanguageExplanation:
      'El partido prometió resolver las ayudas al empleo en un máximo de 15 días. Hay una resolución que fija ese plazo y un informe con un plazo medio de 14 días en el último trimestre analizado.',
    officialSource: {
      title: 'Programa electoral (documento de ejemplo)',
      publisher: 'Alianza Ejemplo',
      url: 'https://example.org/demo/programa-alianza-ejemplo',
      publishedAt: '2023-05-01',
    },
    status: 'done',
    evidence: [
      {
        id: 'ev-emp-002-a',
        kind: 'official_document',
        date: '2025-02-11',
        title: 'Resolución que fija el plazo máximo',
        summary: 'Una resolución establece un plazo máximo de 15 días para tramitar estas ayudas.',
        originalExcerpt: 'El plazo máximo de tramitación será de quince días.',
        source: {
          title: 'Resolución (documento de ejemplo)',
          publisher: 'Ayuntamiento de Ejemplo',
          url: 'https://example.org/demo/resolucion-plazo-15-dias',
          publishedAt: '2025-02-11',
        },
        approved: true,
      },
      {
        id: 'ev-emp-002-b',
        kind: 'official_record',
        date: '2025-11-03',
        title: 'Informe de plazos medios de tramitación',
        summary: 'El informe de ejemplo indica un plazo medio de 14 días en el último trimestre.',
        source: {
          title: 'Informe de plazos (registro de ejemplo)',
          publisher: 'Ayuntamiento de Ejemplo',
          url: 'https://example.org/demo/informe-plazos',
          publishedAt: '2025-11-03',
        },
        approved: true,
      },
    ],
    unverifiedNotes: [
      'El informe no detalla qué solicitudes quedan fuera del cálculo del plazo medio.',
    ],
    lastUpdatedAt: '2026-09-25',
  },
];

// The frontend MVP exposes housing only. The legacy pension/employment rows
// remain in this fixture solely for historical test data and are never shown.
export const mockPromiseRows = allMockPromiseRows.filter((row) => row.topic === 'housing');
