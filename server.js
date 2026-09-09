const express = require('express');
const cors = require('cors');
const path = require('path');
const { Produto, sequelize } = require('./models/Produto');
const routerExtras = require('./routes/extras');

const app = express();
const PORTA = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Registro dos novos endpoints
app.use('/api/extras', routerExtras);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =====================================================
// 🔄 CARREGAMENTO DO CATÁLOGO BIONORTE (dados do PDF)
// =====================================================
const carregarCatalogo = async () => {
  await sequelize.sync({ force: true });

  const catalogo = [
    { codigo: 'BIO-01', nome: 'VIDA S1600', descricao: 'Analisador — 150 testes/hora', categoria: 'Bioquímica' },
    { codigo: 'BIO-02', nome: 'VIDA S2800', descricao: 'Analisador alto desempenho', categoria: 'Bioquímica' },
    { codigo: 'BIO-03', nome: 'VIDA S3800', descricao: 'Analisador intermediário', categoria: 'Bioquímica' },
    { codigo: 'BIO-04', nome: 'VIDA S4800', descricao: 'Analisador linha superior', categoria: 'Bioquímica' },
    { codigo: 'BIO-05', nome: 'L2000-B-PL', descricao: 'Analisador bioquímico', categoria: 'Bioquímica' },

    { codigo: 'COA-01', nome: 'VIDACLOT', descricao: 'Analisador de coagulação', categoria: 'Coagulação' },
    { codigo: 'COA-02', nome: 'VIDA CLOT DUO', descricao: '2 canais', categoria: 'Coagulação' },
    { codigo: 'COA-03', nome: 'CLOTimer DUO Touch', descricao: 'Cronômetro com tela', categoria: 'Coagulação' },

    { codigo: 'HEM-01', nome: 'Vida Count 510', descricao: 'Analisador hematológico', categoria: 'Hematologia' },
    { codigo: 'HEM-02', nome: 'URIT 3000 VET PLUS', descricao: 'Veterinário', categoria: 'Hematologia' },
    { codigo: 'HEM-03', nome: 'URIT 3000 PLUS', descricao: 'Analisador hematológico', categoria: 'Hematologia' },
    { codigo: 'HEM-04', nome: 'URIT 5500', descricao: 'Avançado', categoria: 'Hematologia' },
    { codigo: 'HEM-05', nome: 'URIT 5160', descricao: 'Analisador hematológico', categoria: 'Hematologia' },

    { codigo: 'URO-01', nome: 'URIT 500B', descricao: 'Tiras de urina', categoria: 'Demais Equipamentos' },
    { codigo: 'URO-02', nome: 'URIT US-500', descricao: 'Analisador de urina', categoria: 'Demais Equipamentos' },
    { codigo: 'ISE-01', nome: 'MHLAB ISE', descricao: 'Íons seletivos', categoria: 'Demais Equipamentos' },
    { codigo: 'ISE-02', nome: 'MHLAB ISE PLUS', descricao: 'Íons seletivos avançado', categoria: 'Demais Equipamentos' },
    { codigo: 'ISE-03', nome: 'CARELYTE', descricao: 'Analisador de eletrólitos', categoria: 'Demais Equipamentos' },
    { codigo: 'VCA-01', nome: 'VCA 1000', descricao: 'Analisador', categoria: 'Demais Equipamentos' },
    { codigo: 'VCA-02', nome: 'VCA 500R', descricao: 'Analisador', categoria: 'Demais Equipamentos' },

    { codigo: 'INS-001', nome: 'Reagentes Bioquímica', descricao: 'Kits análises diversas', categoria: 'Insumos e Reagentes' },
    { codigo: 'INS-002', nome: 'Reagentes Coagulação', descricao: 'Tampões, calibração', categoria: 'Insumos e Reagentes' },
    { codigo: 'INS-003', nome: 'Reagentes Hematologia', descricao: 'Diluentes, corantes', categoria: 'Insumos e Reagentes' },
    { codigo: 'INS-004', nome: 'Descartáveis', descricao: 'Tubos, cubetas, ponteiras', categoria: 'Insumos e Reagentes' },

    { codigo: 'SER-01', nome: 'Manutenção Preventiva', descricao: 'Calibração e verificação', categoria: 'Serviços Técnicos' },
    { codigo: 'SER-02', nome: 'Manutenção Corretiva', descricao: 'Reparo de equipamentos', categoria: 'Serviços Técnicos' },
    { codigo: 'SER-03', nome: 'Instalação e Treinamento', descricao: 'Montagem e capacitação', categoria: 'Serviços Técnicos' },
    { codigo: 'SER-04', nome: 'Contrato de Suporte', descricao: 'Atendimento prioritário', categoria: 'Serviços Técnicos' }
  ];

  await Produto.bulkCreate(catalogo);
  console.log(`✅ ${catalogo.length} produtos carregados do catálogo Bionorte`);
};

const iniciarServidor = async () => {
  try {
    await carregarCatalogo();
    app.listen(PORTA, () => {
      console.log('\n🚀 BIONORTE BRASIL — Servidor Ativo');
      console.log(`📍 Acesso: http://localhost:${PORTA}`);
      console.log('\n📋 NOVOS ENDPOINTS:');
      console.log('   GET → /api/extras/resumo-categorias');
      console.log('   GET → /api/extras/buscar?q=termo');
    });
  } catch (erro) {
    console.error('❌ Erro ao iniciar:', erro.message);
  }
};

iniciarServidor();
