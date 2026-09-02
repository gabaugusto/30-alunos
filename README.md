# Turma 24B · Sprint 2 com desbloqueio PRAXIS

## O que mudou
- `students.json` concentra:
  - dados iniciais dos 30 estudantes;
  - 14 novas evidências;
  - código de desbloqueio `PRAXIS`;
  - metadados da atividade.
- Antes de PRAXIS, a squad organiza a turma normalmente.
- Ao inserir `PRAXIS` no final da página:
  - a triagem atual é salva como `snapshotBeforePraxis`;
  - as 14 novas evidências são reveladas;
  - a organização inicial é preservada;
  - os participantes podem repriorizar;
  - a interface mostra `Antes → Agora`;
  - itens alterados recebem `REPRIORIZADO`.
- O estado permanece salvo em `localStorage`.
- A exportação JSON inclui a organização antes e depois de PRAXIS.

## Como executar
Esta versão carrega `students.json` com `fetch`, portanto deve ser servida por HTTP.

Opções:
- VS Code + Live Server;
- `python -m http.server 8000` dentro da pasta;
- qualquer hospedagem web estática.

Depois acesse, por exemplo:
`http://localhost:8000`

## Arquivos
- index.html
- styles.css
- app.js
- students.json
