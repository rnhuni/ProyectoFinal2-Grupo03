INSERT INTO feature (id, name, description, price) VALUES
('frt-characteristics-soporte-técnico-24/7', 'Soporte técnico 24/7', NULL, 1.0),
('frt-characteristics-acceso-a-reportes-detallados', 'Acceso a reportes detallados', NULL, 1.0),
('frt-characteristics-editar-perfiles', 'Editar perfiles', NULL, 1.0),
('frt-characteristics-integración-con-plataformas-externas', 'Integración con plataformas externas', NULL, 1.0),
('frt-characteristics-facturación-automática', 'Facturación automática', NULL, 1.0),
('frt-characteristics-usuarios-permitidos', 'Usuarios permitidos', NULL, 1.0),
('frt-characteristics-espacio-de-almacenamiento', 'Espacio de almacenamiento', NULL, 1.0),
('frt-characteristics-actualizaciones-de-software-automáticas', 'Actualizaciones de software automáticas', NULL, 1.0),
('frt-characteristics-acceso-móvil', 'Acceso móvil', NULL, 1.0),
('frt-characteristics-modificar-usuarios', 'Modificar usuarios', NULL, 1.0),
('frt-characteristics-eliminar-usuarios', 'Eliminar usuarios', NULL, 1.0),
('frt-characteristics-varios-usuarios-al-tiempo', 'Varios usuarios al tiempo', NULL, 1.0),
('frt-characteristics-con-publicidad', 'Con publicidad', NULL, 1.0),
('frt-characteristics-sin-publicidad', 'Sin publicidad', NULL, 1.0),
('frt-characteristics-facturación-periódica', 'Facturación periódica', NULL, 1.0);

-- Plan Básico Connect
INSERT INTO subscription_plan (id, name, description, status, price, features) VALUES
('plan-basico-connect', 'Plan Básico Connect', 'Plan básico con características esenciales', 'active', 10.0, 'frt-characteristics-soporte-técnico-24/7;frt-characteristics-acceso-a-reportes-detallados;frt-characteristics-usuarios-permitidos;frt-characteristics-espacio-de-almacenamiento;frt-characteristics-acceso-móvil;frt-characteristics-con-publicidad;frt-characteristics-facturación-periódica');

-- Plan Pro Engage
INSERT INTO subscription_plan (id, name, description, status, price, features) VALUES
('plan-pro-engage', 'Plan Pro Engage', 'Plan avanzado con características mejoradas', 'active', 50.0, 'frt-characteristics-soporte-técnico-24/7;frt-characteristics-acceso-a-reportes-detallados;frt-characteristics-editar-perfiles;frt-characteristics-facturación-automática;frt-characteristics-usuarios-permitidos;frt-characteristics-espacio-de-almacenamiento;frt-characteristics-actualizaciones-de-software-automáticas;frt-characteristics-acceso-móvil;frt-characteristics-varios-usuarios-al-tiempo;frt-characteristics-sin-publicidad;frt-characteristics-facturación-periódica');

-- Plan Premium Master
INSERT INTO subscription_plan (id, name, description, status, price, features) VALUES
('plan-premium-master', 'Plan Premium Master', 'Plan completo con todas las características premium', 'active', 100.0, 'frt-characteristics-soporte-técnico-24/7;frt-characteristics-acceso-a-reportes-detallados;frt-characteristics-editar-perfiles;frt-characteristics-integración-con-plataformas-externas;frt-characteristics-facturación-automática;frt-characteristics-usuarios-permitidos;frt-characteristics-espacio-de-almacenamiento;frt-characteristics-actualizaciones-de-software-automáticas;frt-characteristics-acceso-móvil;frt-characteristics-modificar-usuarios;frt-characteristics-eliminar-usuarios;frt-characteristics-varios-usuarios-al-tiempo;frt-characteristics-sin-publicidad;frt-characteristics-facturación-periódica');
