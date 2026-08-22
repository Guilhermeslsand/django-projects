import { carregarEstacas, carregarUnidades } from './formulario-func/api.js';
import { obterBooleano, atualizarParticipacaoDOM, atualizarMotivoOutrosDOM, atualizarTransporteDOM, atualizarFamiliarDOM } from './formulario-func/fluxo.js';
import { validarEAbrirModal, fecharModal, enviarViaAPI } from './formulario-func/modal.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formulario-cjas");
    const estacaSelect = document.getElementById("estaca");
    const unidadeSelect = document.getElementById("unidade");
    const API_URL = form.dataset.apiUrl || "/cjas/api/V1/formularios/";

    const elementos = {
        form,
        estacaSelect,
        unidadeSelect,
        secaoNaoParticipacao: document.getElementById("secao-nao-participacao"),
        secaoMotivoOutros: document.getElementById("secao-motivo-outros"),
        secaoConfirmacaoCancelamento: document.getElementById("secao-confirmacao-cancelamento"),
        secaoTransporte: document.getElementById("transporte"),
        secaoHorarioDetalhes: document.getElementById("seccao-horario-detalhes"), // <--- Ajustado para o ID novo
        secaoFamiliar: document.getElementById("familiar"),
        secaoFamiliarDetalhes: document.getElementById("secao-familiar-detalhes"),
        cardQrCode: document.getElementById("qr-code"),
        cardSaude: document.getElementById("saude"),
        motivoNaoParticipacao: document.getElementById("motivo_nao_participacao"),
        motivoOutros: document.getElementById("motivo_outros"),
        confirmacaoCancelamento: document.getElementById("confirmacao-cancelamento"),
        horarioChegada: document.getElementById("horario_chegada_sabado"),
        confirmacaoTransporte: document.getElementById("confirmacao-transporte"),
        familiarNome: document.getElementById("familiar_nome")
    };

    const handlers = {
        limparTransporte: () => {
            document.querySelectorAll('input[name="vai_onibus_sexta"]').forEach(i => { i.checked = false; i.required = false; });
            elementos.horarioChegada.required = false;
            elementos.horarioChegada.value = "";
            elementos.confirmacaoTransporte.required = false;
            elementos.confirmacaoTransporte.checked = false;
        },
        limparNaoParticipacao: () => {
            elementos.motivoNaoParticipacao.value = "";
            elementos.motivoNaoParticipacao.required = false;
            elementos.motivoOutros.value = "";
            elementos.motivoOutros.required = false;
        },
        atualizarMotivoOutros: () => atualizarMotivoOutrosDOM(elementos.motivoNaoParticipacao, elementos.secaoMotivoOutros, elementos.motivoOutros),
        atualizarTransporte: () => atualizarTransporteDOM(obtenhaVaiCjas(), obterBooleano("vai_onibus_sexta"), elementos.secaoHorarioDetalhes, elementos.horarioChegada, elementos.confirmacaoTransporte),
        atualizarFamiliar: () => atualizarFamiliarDOM(obtenhaVaiCjas(), obterBooleano("tem_familiar_cjas"), elementos.secaoFamiliarDetalhes, elementos.familiarNome)
    };

    function obtenhaVaiCjas() { return obterBooleano("vai_cjas"); }
    function mostrarErro(msg) { alert(msg); }

    // Inicialização e Eventos
    carregarEstacas(estacaSelect, mostrarErro);
    handlers.atualizarMotivoOutros();
    handlers.atualizarTransporte();
    handlers.atualizarFamiliar();

    estacaSelect.addEventListener("change", () => carregarUnidades(estacaSelect, unidadeSelect, mostrarErro));
    document.querySelectorAll('input[name="vai_cjas"]').forEach(i => i.addEventListener("change", () => atualizarParticipacaoDOM(obtenhaVaiCjas(), elementos, handlers)));
    document.querySelectorAll('input[name="vai_onibus_sexta"]').forEach(i => i.addEventListener("change", handlers.atualizarTransporte));
    document.querySelectorAll('input[name="tem_familiar_cjas"]').forEach(i => i.addEventListener("change", handlers.atualizarFamiliar));
    elementos.motivoNaoParticipacao.addEventListener("change", handlers.atualizarMotivoOutros);

    // Funções globais chamadas pelo HTML (botões)
    window.abrirModalRevisao = () => validarEAbrirModal(form, elementos);
    window.fecharModal = fecharModal;
    window.enviarViaAPI = () => enviarViaAPI(API_URL, elementos, mostrarErro);

    // Função global ligada ao botão "Limpar formulário" do HTML
    window.limparFormulario = () => {
        import('./modal.js').then(module => {
            module.limparFormularioCompleto(form, elementos);
        });
    };

    // Função global de fechar modal atualizada
    window.fecharModal = () => {
        const modal = document.getElementById("modal-revisao");
        modal.classList.remove("active");
        modal.style.display = "none";
    };
});