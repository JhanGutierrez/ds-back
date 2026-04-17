-- CreateTable
CREATE TABLE "purchase_suggestion_history" (
    "id" SERIAL NOT NULL,
    "compra_sugerida_id" INTEGER,
    "usuario_id" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "cambios" JSONB,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_suggestion_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_suggestion_status" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "purchase_suggestion_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_suggestions" (
    "id" SERIAL NOT NULL,
    "mc" TEXT NOT NULL,
    "mca" TEXT NOT NULL,
    "mcap" TEXT,
    "codigo_material" INTEGER NOT NULL,
    "descripcion_material" TEXT NOT NULL,
    "cod_prov" TEXT NOT NULL,
    "proveedor" TEXT NOT NULL,
    "centro_abastecedor" TEXT NOT NULL,
    "des_dentro" TEXT,
    "porc_compra" INTEGER,
    "almacen" INTEGER NOT NULL,
    "categoria" TEXT,
    "lt_real" INTEGER NOT NULL,
    "factor_lt" DECIMAL(8,4) NOT NULL,
    "frec" DECIMAL(8,4) NOT NULL,
    "ump" INTEGER NOT NULL,
    "ums" INTEGER NOT NULL,
    "venta_30_dias_dia_del_dia" DECIMAL(14,6) NOT NULL,
    "venta_fc_dia_ajustada" DECIMAL(14,6) NOT NULL,
    "porc_desviacion_fc_vs_venta" DECIMAL(10,6),
    "porc_inc_planeacion_demanda" DECIMAL(10,6),
    "aplica" TEXT,
    "pedido_promedio_dia_ump" INTEGER NOT NULL,
    "tiendas_agotadas" INTEGER,
    "tipologia" INTEGER,
    "inv_tienda" DECIMAL(14,6),
    "stock_objetivo_tienda" DECIMAL(14,6),
    "faltante_llenado_tienda" DECIMAL(14,6),
    "dias_inv_tienda" DECIMAL(10,6),
    "inventario_fisico" DECIMAL(14,6),
    "inventario_en_transito" INTEGER,
    "dias_inv_a_la_fecha" DECIMAL(10,6),
    "dias_inv_fisico_transito" DECIMAL(10,6),
    "zonaroja_pura" DECIMAL(14,6),
    "zonaroja" DECIMAL(14,6),
    "zonaamarilla" DECIMAL(14,6),
    "zonaverde" DECIMAL(14,6),
    "tam_buffer_puro_ump" DECIMAL(14,6),
    "tam_buffer_ump" DECIMAL(14,6),
    "demanda_calificada" DECIMAL(14,6),
    "activo_lunes" BOOLEAN NOT NULL,
    "activo_martes" BOOLEAN NOT NULL,
    "activo_miercoles" BOOLEAN NOT NULL,
    "activo_jueves" BOOLEAN NOT NULL,
    "activo_viernes" BOOLEAN NOT NULL,
    "activo_sabado" BOOLEAN NOT NULL,
    "activo_domingo" BOOLEAN NOT NULL,
    "pedido_hoy" INTEGER NOT NULL,
    "pedido_f1" INTEGER,
    "pedido_f2" INTEGER,
    "pedido_f3" INTEGER,
    "pedido_f4" INTEGER,
    "pedido_f5" INTEGER,
    "pedido_f6" INTEGER,
    "estimado_para_tope_buffer" INTEGER,
    "cantidad_definitiva_oc_hoy" DECIMAL(14,4),
    "cantidad_definitiva_oc_f1" DECIMAL(14,4),
    "cantidad_definitiva_oc_f2" DECIMAL(14,4),
    "cantidad_definitiva_oc_f3" DECIMAL(14,4),
    "factor_variabilidad_venta" DECIMAL(8,4),
    "dias_minimo_inv" DECIMAL(10,4),
    "dias_promedio_inv" DECIMAL(10,4),
    "dias_maximo_inv" DECIMAL(10,4),
    "dias_inv_cantidad_definitiva" DECIMAL(10,6),
    "dias_inv_cd_f1" DECIMAL(10,6),
    "dias_inv_cd_f2" DECIMAL(10,6),
    "dias_inv_cd_f3" DECIMAL(10,6),
    "dia_de_pedido" TEXT,
    "dia_de_llegada" TEXT,
    "fecha_estimada_entrega" TIMESTAMP(3),
    "nom_dia_entrega" TEXT,
    "fecha_entrega_f1" TIMESTAMP(3),
    "fecha_entrega_f2" TIMESTAMP(3),
    "fecha_entrega_f3" TIMESTAMP(3),
    "alerta_stock" TEXT,
    "vida_util_min_dias_recibo_cedi" INTEGER,
    "alerta_vida_util" TEXT,
    "cross_dock" BOOLEAN,
    "moq" INTEGER,
    "subcategoria" TEXT,
    "temperatura_almacenamiento" TEXT,
    "responsable_de_compra" TEXT,
    "category" TEXT,
    "multiplo_de_compra" INTEGER,
    "estado" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "usuario_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("usuario_id","role_id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "correo" TEXT NOT NULL,
    "nombre_usuario" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "contrasena" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "purchase_suggestion_status_codigo_key" ON "purchase_suggestion_status"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_suggestions_mc_key" ON "purchase_suggestions"("mc");

-- CreateIndex
CREATE INDEX "purchase_suggestions_codigo_material_idx" ON "purchase_suggestions"("codigo_material");

-- CreateIndex
CREATE INDEX "purchase_suggestions_centro_abastecedor_idx" ON "purchase_suggestions"("centro_abastecedor");

-- CreateIndex
CREATE INDEX "purchase_suggestions_estado_idx" ON "purchase_suggestions"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "role_nombre_key" ON "role"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "user_correo_key" ON "user"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "user_nombre_usuario_key" ON "user"("nombre_usuario");

-- AddForeignKey
ALTER TABLE "purchase_suggestion_history" ADD CONSTRAINT "purchase_suggestion_history_compra_sugerida_id_fkey" FOREIGN KEY ("compra_sugerida_id") REFERENCES "purchase_suggestions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_suggestion_history" ADD CONSTRAINT "purchase_suggestion_history_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_suggestions" ADD CONSTRAINT "purchase_suggestions_estado_fkey" FOREIGN KEY ("estado") REFERENCES "purchase_suggestion_status"("codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
