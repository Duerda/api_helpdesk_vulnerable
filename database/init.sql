-- Dados inteiramente fictícios. Usar apenas em laboratório local.
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(150) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'requester'
);
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(25) NOT NULL DEFAULT 'open',
  requester_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users(name,email,password_hash,role) VALUES
('Ana Silva','ana@example.test','$2b$10$5HcL0VvbcKiaVQVMXhVms.vlFbCVhTkVj4kWTEhuQwk/58JC./98m','requester'),
('Bruno Costa','bruno@example.test','$2b$10$VX.DpNaVcEkN97QdvjsEjeUmsOSjHFwYN3Xs8cRDquGPTq9z7GXQ2','requester'),
('Carla Suporte','carla@example.test','$2b$10$K3u/pXwqZUGLJ2sba6LLKe6pMNdRSI0s3iNyXEt4pu3PxhAITytae','support');
INSERT INTO tickets(title, description, status, requester_id) VALUES
('Computador não liga','Desktop da sala 3 não inicia.','open',1),
('Problema no Wi-Fi','Notebook perde a conexão com a rede.','in_progress',2),
('Instalação de impressora','Solicitação de configuração da impressora.','closed',1),
('Erro no acesso ao portal','Página retorna mensagem de erro no login.','open',2);
