export async function carregarEstacas(estacaSelect, mostrarErroCb) {
    try {
        estacaSelect.disabled = true;
        const response = await fetch("/cjas/api/V1/estacas/");
        if (!response.ok) throw new Error("Erro de rede.");
        
        const estacas = await response.json();
        estacaSelect.innerHTML = `<option value="" disabled selected>Selecione sua estaca</option>`;
        estacas.forEach(e => estacaSelect.innerHTML += `<option value="${e.id}">${e.nome}</option>`);
    } catch (error) {
        console.error(error);
        mostrarErroCb("Não foi possível carregar as estacas.");
    } finally {
        estacaSelect.disabled = false;
    }
}

export async function carregarUnidades(estacaSelect, unidadeSelect, mostrarErroCb) {
    const estacaId = estacaSelect.value;
    unidadeSelect.innerHTML = `<option value="" disabled selected>Carregando...</option>`;
    unidadeSelect.disabled = true;

    if (!estacaId) return;

    try {
        const response = await fetch(`/cjas/api/V1/estacas/${estacaId}/unidades/`);
        if (!response.ok) throw new Error("Erro de rede.");
        
        const unidades = await response.json();
        unidadeSelect.innerHTML = `<option value="" disabled selected>Selecione sua ala/ramo</option>`;
        unidades.forEach(u => unidadeSelect.innerHTML += `<option value="${u.id}">${u.nome}</option>`);
        unidadeSelect.disabled = unidades.length === 0;
    } catch (error) {
        console.error(error);
        mostrarErroCb("Não foi possível carregar as unidades.");
    }
}