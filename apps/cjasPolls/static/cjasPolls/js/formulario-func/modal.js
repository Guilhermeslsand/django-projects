import { obterBooleano } from './fluxo.js';

export function validarEAbrirModal(form, elementos) {
    const { motivoNaoParticipacao, motivoOutros, confirmacaoCancelamento } = elementos;
    const vaiCjas = obterBooleano("vai_cjas");

    if (vaiCjas === null) {
        alert("Por favor, informe se você irá participar do CJAS.");
        return;
    }

    if (vaiCjas === false) {
        if (!motivoNaoParticipacao.value) {
            alert("Por favor, informe o motivo de não participação.");
            motivoNaoParticipacao.focus();
            return;
        }
        if (motivoNaoParticipacao.value === "OUTROS" && !motivoOutros.value.trim()) {
            alert("Por favor, explique o motivo.");
            motivoOutros.focus();
            return;
        }
    } else {
        const recebeuQr = obterBooleano("recebeu_qr_code");
        const temFamiliar = obterBooleano("tem_familiar_cjas");
        const saude = obterBooleano("precisa_contato_saude");

        if (recebeuQr === null) {
            alert("Por favor, informe se você recebeu o QR Code no seu e-mail.");
            return;
        }
        if (temFamiliar === null) {
            alert("Por favor, informe se algum familiar do mesmo sexo vai para o CJAS.");
            return;
        }
        if (saude === null) {
            alert("Por favor, responda sobre a questão de saúde.");
            return;
        }
    }

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const dados = coletarDadosFormulario(elementos);
    document.getElementById("modal-body-content").innerHTML = gerarResumo(dados);
    
    const modal = document.getElementById("modal-revisao");
    modal.classList.add("active");
    modal.style.display = "flex";
}

// Adicionamos a função de limpeza interna que recebe o form e os elementos
export function fecharModal(form, elementos) {
    // 1. Fecha o modal visualmente
    const modal = document.getElementById("modal-revisao");
    modal.classList.remove("active");
    modal.style.display = "none";
}

// Função específica para resetar e limpar toda a sujeira do formulário
export function limparFormularioCompleto(form, elementos) {
    // Reseta nativamente todos os inputs do form
    form.reset();

    // Reseta o select de unidades para o estado desativado original
    const { unidadeSelect } = elementos;
    unidadeSelect.innerHTML = `<option value="" disabled selected>Selecione primeiro sua estaca</option>`;
    unidadeSelect.disabled = true;

    // Oculta todas as seções condicionais novamente via atributo hidden
    const { 
        secaoNaoParticipacao, 
        secaoConfirmacaoCancelamento, 
        secaoMotivoOutros, 
        secaoTransporte, 
        secaoHorarioDetalhes, 
        secaoFamiliarDetalhes, 
        cardQrCode, 
        secaoFamiliar, 
        cardSaude 
    } = elementos;

    if (secaoNaoParticipacao) secaoNaoParticipacao.hidden = true;
    if (secaoConfirmacaoCancelamento) secaoConfirmacaoCancelamento.hidden = true;
    if (secaoMotivoOutros) secaoMotivoOutros.hidden = true;
    if (secaoTransporte) secaoTransporte.hidden = true;
    if (secaoHorarioDetalhes) secaoHorarioDetalhes.hidden = true;
    if (secaoFamiliarDetalhes) secaoFamiliarDetalhes.hidden = true;
    if (cardQrCode) cardQrCode.hidden = true;
    if (secaoFamiliar) secaoFamiliar.hidden = true;
    if (cardSaude) cardSaude.hidden = true;

    // Remove a obrigatoriedade dos campos ocultos para não travar o form limpo
    elementos.motivoNaoParticipacao.required = false;
    elementos.motivoOutros.required = false;
    if (elementos.confirmacaoCancelamento) elementos.confirmacaoCancelamento.required = false;
    elementos.horarioChegada.required = false;
    elementos.confirmacaoTransporte.required = false;
    elementos.familiarNome.required = false;
    document.querySelectorAll('input[name="compartilhar_cama"]').forEach(i => i.required = false);
}

function coletarDadosFormulario(elementos) {
    const { estacaSelect, unidadeSelect, motivoNaoParticipacao, motivoOutros, horarioChegada, familiarNome } = elementos;
    const vaiCjas = obterBooleano("vai_cjas");
    const vaiOnibus = obterBooleano("vai_onibus_sexta");
    const temFamiliar = obterBooleano("tem_familiar_cjas");
    
    return {
        nome_completo: document.getElementById("nome_completo").value.trim(),
        estaca_id: estacaSelect.value,
        estaca_nome: estacaSelect.options[estacaSelect.selectedIndex]?.text || "",
        unidade_id: unidadeSelect.value,
        unidade_nome: unidadeSelect.options[unidadeSelect.selectedIndex]?.text || "",
        vai_cjas: vaiCjas,
        motivo_nao_participacao: vaiCjas === false ? motivoNaoParticipacao.value : null,
        motivos_outros: (vaiCjas === false && motivoNaoParticipacao.value === "OUTROS") ? motivoOutros.value.trim() : "",
        vai_onibus_sexta: vaiCjas === true ? vaiOnibus : false,
        horario_chegada_sabado: (vaiCjas === true && vaiOnibus === false) ? horarioChegada.value : null,
        recebeu_qr_code: vaiCjas === true ? obterBooleano("recebeu_qr_code") : false,
        tem_familiar_cjas: vaiCjas === true ? temFamiliar : false,
        familiar_nome: (vaiCjas === true && temFamiliar === true) ? familiarNome.value.trim() : "",
        compartilhar_cama: (vaiCjas === true && temFamiliar === true) ? obterBooleano("compartilhar_cama") : false,
        precisa_contato_saude: vaiCjas === true ? obterBooleano("precisa_contato_saude") : false
    };
}

export async function enviarViaAPI(API_URL, elementos, mostrarErroCb) {
    const dados = coletarDadosFormulario(elementos);
    const payload = {
        ...dados,
        estaca: Number(dados.estaca_id),
        unidade: Number(dados.unidade_id)
    };
    
    delete payload.estaca_id;
    delete payload.estaca_nome;
    delete payload.unidade_id;
    delete payload.unidade_nome;

    const btn = document.querySelector("#modal-revisao .submit-btn");

    try {
        btn.disabled = true;
        btn.textContent = "Enviando...";

        const csrf = document.querySelector("[name=csrfmiddlewaretoken]");
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrf ? csrf.value : ""
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const resData = await response.json();
            console.error(resData);
            mostrarErroCb("Houve erros de validação no servidor. Verifique os dados e tente novamente.");
            return;
        }

        fecharModal(elementos.form, elementos);
        limparFormularioCompleto(elementos.form, elementos); // <--- Limpa tudo ao enviar com sucesso
        window.location.href = "/cjas/sucesso/";

    } catch (error) {
        console.error(error);
        mostrarErroCb("Erro de rede. Verifique sua conexão e tente novamente.");
    } finally {
        btn.disabled = false;
        btn.textContent = "Enviar Inscrição";
    }
}

function gerarResumo(dados) {
    let html = criarGrupoResumo("Identificação", [
        criarItemResumo("Nome completo", dados.nome_completo),
        criarItemResumo("Estaca", dados.estaca_nome),
        criarItemResumo("Ala/Ramo", dados.unidade_nome)
    ]);

    const partItens = [criarItemResumo("Vai participar do CJAS?", dados.vai_cjas ? "Sim" : "Não")];
    if (dados.vai_cjas === false) {
        const motivos = { TRABALHO: "Vou trabalhar", VIAGEM: "Vou viajar", NAO_QUERO: "Não quero mais participar", OUTROS: "Outro" };
        partItens.push(criarItemResumo("Motivo", motivos[dados.motivo_nao_participacao] || ""));
        if (dados.motivo_nao_participacao === "OUTROS") {
            partItens.push(criarItemResumo("Explicação", dados.motivos_outros));
        }
    }
    html += criarGrupoResumo("Participação", partItens);

    if (dados.vai_cjas === true) {
        const transItens = [criarItemResumo("Vai de ônibus na sexta?", dados.vai_onibus_sexta ? "Sim" : "Não")];
        if (dados.vai_onibus_sexta === false) {
            transItens.push(criarItemResumo("Horário de chegada", dados.horario_chegada_sabado));
            transItens.push(criarItemResumo("Irá por conta própria", "Confirmado"));
        }
        html += criarGrupoResumo("Transporte", transItens);

        html += criarGrupoResumo("QR Code", [
            criarItemResumo("Recebeu o QR Code?", dados.recebeu_qr_code ? "Sim" : "Não")
        ]);

        const famItens = [criarItemResumo("Possui familiar no CJAS?", dados.tem_familiar_cjas ? "Sim" : "Não")];
        if (dados.tem_familiar_cjas === true) {
            famItens.push(criarItemResumo("Nome", dados.familiar_nome));
            famItens.push(criarItemResumo("Compartilhar cama?", dados.compartilhar_cama ? "Sim" : "Não"));
        }
        html += criarGrupoResumo("Familiar", famItens);

        html += criarGrupoResumo("Saúde", [
            criarItemResumo("Deseja adicionar alguma questão de saúde?", dados.precisa_contato_saude ? "Sim" : "Não")
        ]);
    }

    return html;
}

function criarGrupoResumo(titulo, itens) {
    return `
        <section style="margin-bottom: 20px;">
            <h3 style="margin-bottom: 8px; color: var(--primary-brown); font-size: 16px;">${escaparHTML(titulo)}</h3>
            <div style="display:flex; flex-direction:column; gap:8px;">${itens.join("")}</div>
        </section>
    `;
}

function criarItemResumo(label, valor) {
    return `
        <div style="border-bottom: 1px solid #f1f3f4; padding-bottom: 4px;">
            <div style="font-size: 13px; color: #5f6368;">${escaparHTML(label)}</div>
            <div style="font-size: 15px; color: #202124; font-weight: 500;">${escaparHTML(String(valor ?? ""))}</div>
        </div>
    `;
}

function escaparHTML(valor) {
    return valor.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}