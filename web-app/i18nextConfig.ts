// i18nextConfig.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        lng: 'es', // idioma predeterminado
        resources: {
            es: {
                common: {
                    status: "Estado",
                    creation_date: "Fecha de Creación",
                    edition_date: "Fecha de Edición",
                    actions: "Acciones",
                    actions_edit: "Editar",
                    actions_delete: "Eliminar",
                    button: {
                        cancel: "Cancelar",
                        edit: "Editar",
                        create: "Crear"
                    }
                },
                permissions: {
                    name: "Nombre",
                    description: "Descripción",
                    title: "Permisos de la Plataforma",
                    create: "Crear Permiso",
                    validations: {
                        name: "El nombre debe tener al menos {{count}} caracteres.",
                        description: "La descripción debe tener al menos {{count}} caracteres.",
                        status: "Valor no válido para el estado."
                    },
                    modal: {
                        edit: "Editar Permiso",
                        create: "Crear Permiso"
                    }
                }
            }
        },
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false // React ya se encarga de esto
        }
    });

export default i18n;
