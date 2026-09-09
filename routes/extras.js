const express = require('express');
const router = express.Router();
const { Produto, Op } = require('../models/Produto');

// =====================================================
// ✅ NOVO ENDPOINT 1: Resumo por Categoria
// GET /api/extras/resumo-categorias
// =====================================================
router.get('/resumo-categorias', async (req, res) => {
  try {
    const categorias = [
      'Bioquímica', 'Coagulação', 'Hematologia',
      'Demais Equipamentos', 'Insumos e Reagentes', 'Serviços Técnicos'
    ];

    const resumo = [];
    let totalGeral = 0;

    for (const cat of categorias) {
      const qtd = await Produto.count({ where: { categoria: cat } });
      resumo.push({ categoria: cat, quantidade_produtos: qtd });
      totalGeral += qtd;
    }

    return res.status(200).json({
      sucesso: true,
      total_geral: totalGeral,
      total_categorias: categorias.length,
      dados: resumo
    });
  } catch (erro) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao gerar resumo por categorias',
      erro: erro.message
    });
  }
});

// =====================================================
// ✅ NOVO ENDPOINT 2: Busca Flexível
// GET /api/extras/buscar?q=termo
// =====================================================
router.get('/buscar', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Informe pelo menos 2 caracteres na busca'
      });
    }

    const resultados = await Produto.findAll({
      where: {
        [Op.or]: [
          { codigo: { [Op.like]: `%${q}%` } },
          { nome: { [Op.like]: `%${q}%` } }
        ]
      },
      order: [['nome', 'ASC']]
    });

    return res.status(200).json({
      sucesso: true,
      termo_buscado: q,
      quantidade_encontrada: resultados.length,
      dados: resultados
    });
  } catch (erro) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro na busca de produtos',
      erro: erro.message
    });
  }
});

module.exports = router;
