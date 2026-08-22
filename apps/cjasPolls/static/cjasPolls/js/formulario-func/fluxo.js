export function obterBooleano(nome) {
    const selecionado = document.querySelector(`input[name="${nome}"]:checked`);
    return selecionado ? selecionado.value === "true" : null;
}

export function mostrar(el) { if (el) el.hidden = false; }
export function esconder(el) { if (el) el.hidden = true; }

export function atualizarParticipacaoDOM(vaiCjas, elementos, handlers) {
    const { secaoNaoParticipacao, secaoConfirmacaoCancelamento, secaoTransporte, cardQrCode, secaoFamiliar, cardSaude, motivoNaoParticipacao, confirmacaoCancelamento } = elementos;

    if (vaiCjas === false) {
        mostrar(secaoNaoParticipacao);
        mostrar(secaoConfirmacaoCancelamento);
        motivoNaoParticipacao.required = true;
        if (confirmacaoCancelamento) confirmacaoCancelamento.required = true;

        esconder(secaoTransporte);
        esconder(cardQrCode);
        esconder(secaoFamiliar);
        esconder(cardSaude);
        
        handlers.limparTransporte();
        handlers.atualizarMotivoOutros();
    } else if (vaiCjas === true) {
        esconder(secaoNaoParticipacao);
        esconder(secaoConfirmacaoCancelamento);
        motivoNaoParticipacao.required = false;
        if (confirmacaoCancelamento) {
            confirmacaoCancelamento.required = false;
            confirmacaoCancelamento.checked = false;
        }
        handlers.limparNaoParticipacao();

        mostrar(secaoTransporte);
        mostrar(cardQrCode);
        mostrar(secaoFamiliar);
        mostrar(cardSaude);
        
        handlers.atualizarTransporte();
        handlers.atualizarFamiliar();
    }
}

export function atualizarMotivoOutrosDOM(motivoNaoParticipacao, secaoMotivoOutros, motivoOutros) {
    if (!motivoNaoParticipacao) return;

    // Se a opção escolhida for "OUTROS", exibe a seção e torna o campo obrigatório
    if (motivoNaoParticipacao.value === "OUTROS") {
        mostrar(secaoMotivoOutros);
        motivoOutros.required = true;
    } else {
        // Caso contrário, oculta a seção, limpa o texto e remove a obrigatoriedade
        esconder(secaoMotivoOutros);
        motivoOutros.required = false;
        motivoOutros.value = "";
    }
}

export function atualizarTransporteDOM(vaiCjas, vaiOnibus, secaoHorarioDetalhes, horarioChegada, confirmacaoTransporte) {
    if (vaiCjas === true && vaiOnibus === false) {
        mostrar(secaoHorarioDetalhes);
        horarioChegada.required = true;
        confirmacaoTransporte.required = true;
    } else {
        esconder(secaoHorarioDetalhes);
        horarioChegada.required = false;
        horarioChegada.value = "";
        confirmacaoTransporte.required = false;
        confirmacaoTransporte.checked = false;
    }
}

export function atualizarFamiliarDOM(vaiCjas, temFamiliar, secaoFamiliarDetalhes, familiarNome) {
    if (vaiCjas === true && temFamiliar === true) {
        mostrar(secaoFamiliarDetalhes);
        familiarNome.required = true;
        document.querySelectorAll('input[name="compartilhar_cama"]').forEach(i => i.required = true);
    } else {
        esconder(secaoFamiliarDetalhes);
        familiarNome.required = false;
        familiarNome.value = "";
        document.querySelectorAll('input[name="compartilhar_cama"]').forEach(i => {
            i.required = false;
            i.checked = false;
        });
    }
}