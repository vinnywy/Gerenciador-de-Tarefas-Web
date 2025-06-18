-- Verifica se a coluna já existe antes de adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'atualizado_em'
    ) THEN
        ALTER TABLE tasks ADD COLUMN atualizado_em timestamp DEFAULT now();
        
        -- Atualiza registros existentes com a data de criação
        UPDATE tasks SET atualizado_em = data_criacao WHERE atualizado_em IS NULL;
        
        RAISE NOTICE 'Campo atualizado_em adicionado com sucesso à tabela tasks';
    ELSE
        RAISE NOTICE 'Campo atualizado_em já existe na tabela tasks';
    END IF;
END $$;
