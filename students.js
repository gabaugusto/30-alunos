const STUDENTS = [
  {
    "id": "A01",
    "name": "Ana Clara",
    "age": 19,
    "attendance": 96,
    "deliveries": 100,
    "participation": "Alta",
    "evidence": "Participa com frequência, entrega no prazo e costuma ajudar colegas sem assumir o trabalho por eles.",
    "context": "Entrou no curso buscando ampliar repertório profissional e demonstra clareza sobre o objetivo do curso."
  },
  {
    "id": "A02",
    "name": "Bruno",
    "age": 21,
    "attendance": 82,
    "deliveries": 85,
    "participation": "Média",
    "evidence": "Teve três atrasos nas últimas duas semanas, mas mantém bom desempenho nas atividades.",
    "context": "Começou um trabalho temporário recentemente e comentou que ainda está ajustando horários."
  },
  {
    "id": "A03",
    "name": "Camila",
    "age": 18,
    "attendance": 91,
    "deliveries": 70,
    "participation": "Baixa",
    "evidence": "Presente na maior parte das aulas, porém deixou duas entregas incompletas e quase não fala nos trabalhos em grupo.",
    "context": "Diz que prefere observar antes de opinar e ainda está conhecendo a turma."
  },
  {
    "id": "A04",
    "name": "Diego",
    "age": 22,
    "attendance": 76,
    "deliveries": 92,
    "participation": "Alta",
    "evidence": "Falta mais que a média, mas quando está presente participa muito e recupera atividades rapidamente.",
    "context": "Relatou dificuldade com o tempo de deslocamento em alguns dias da semana."
  },
  {
    "id": "A05",
    "name": "Eduarda",
    "age": 20,
    "attendance": 98,
    "deliveries": 95,
    "participation": "Alta",
    "evidence": "Boa frequência e entregas. Nas últimas aulas passou a centralizar decisões do grupo e demonstrar impaciência.",
    "context": "É reconhecida pelos colegas como referência técnica do grupo."
  },
  {
    "id": "A06",
    "name": "Felipe",
    "age": 19,
    "attendance": 88,
    "deliveries": 60,
    "participation": "Média",
    "evidence": "Frequência razoável, mas três atividades recentes não foram concluídas.",
    "context": "Afirma entender o conteúdo em aula, porém diz que se perde quando precisa organizar as tarefas sozinho."
  },
  {
    "id": "A07",
    "name": "Gabriela",
    "age": 18,
    "attendance": 93,
    "deliveries": 90,
    "participation": "Baixa",
    "evidence": "Entrega bem, mas raramente pede ajuda. Em uma atividade recente permaneceu quase toda a aula sem interagir.",
    "context": "Prefere tarefas individuais e costuma se comunicar mais por escrito."
  },
  {
    "id": "A08",
    "name": "Henrique",
    "age": 22,
    "attendance": 84,
    "deliveries": 80,
    "participation": "Média",
    "evidence": "A participação caiu nas duas últimas semanas e ele passou a perguntar com frequência quando o conteúdo será “mais prático”.",
    "context": "Chegou ao curso com expectativa de aplicação imediata no trabalho."
  },
  {
    "id": "A09",
    "name": "Isabela",
    "age": 20,
    "attendance": 100,
    "deliveries": 88,
    "participation": "Alta",
    "evidence": "Presença total e participação alta. Teve uma entrega abaixo do padrão e pediu devolutiva detalhada.",
    "context": "Demonstra forte interesse em melhorar e costuma registrar os feedbacks recebidos."
  },
  {
    "id": "A10",
    "name": "João Pedro",
    "age": 19,
    "attendance": 79,
    "deliveries": 75,
    "participation": "Baixa",
    "evidence": "Acumulou duas faltas consecutivas e não respondeu à última mensagem geral da turma.",
    "context": "Até duas semanas atrás mantinha frequência próxima de 95%."
  },
  {
    "id": "A11",
    "name": "Karen",
    "age": 21,
    "attendance": 94,
    "deliveries": 90,
    "participation": "Alta",
    "evidence": "Mantém boa frequência, mas começou a discordar publicamente da divisão de tarefas no grupo.",
    "context": "Tem iniciativa e costuma assumir a organização quando percebe falta de definição."
  },
  {
    "id": "A12",
    "name": "Lucas",
    "age": 18,
    "attendance": 87,
    "deliveries": 78,
    "participation": "Média",
    "evidence": "Chega no horário e acompanha a aula, mas deixou de registrar duas etapas de um projeto coletivo.",
    "context": "Diz que o grupo decide muito rápido e que às vezes não sabe onde contribuir."
  },
  {
    "id": "A13",
    "name": "Mariana",
    "age": 22,
    "attendance": 72,
    "deliveries": 65,
    "participation": "Média",
    "evidence": "Quatro faltas recentes, uma entrega não realizada e uma atividade enviada depois do prazo.",
    "context": "Comentou que sua rotina pessoal mudou nas últimas semanas, sem detalhar."
  },
  {
    "id": "A14",
    "name": "Nicolas",
    "age": 20,
    "attendance": 97,
    "deliveries": 100,
    "participation": "Média",
    "evidence": "Bom desempenho geral. Nas últimas aulas passou a terminar rapidamente e usar o restante do tempo em atividades próprias.",
    "context": "Já teve contato prévio com parte dos conteúdos do curso."
  },
  {
    "id": "A15",
    "name": "Olívia",
    "age": 19,
    "attendance": 90,
    "deliveries": 82,
    "participation": "Alta",
    "evidence": "Participa bastante, mas demonstrou frustração após receber feedback crítico em um projeto.",
    "context": "Costuma revisar trabalhos várias vezes antes de considerar uma entrega pronta."
  },
  {
    "id": "A16",
    "name": "Paulo",
    "age": 21,
    "attendance": 85,
    "deliveries": 88,
    "participation": "Baixa",
    "evidence": "Frequência caiu levemente e passou a sentar afastado do grupo com que trabalhava antes.",
    "context": "Não houve queda significativa de desempenho até o momento."
  },
  {
    "id": "A17",
    "name": "Queila",
    "age": 18,
    "attendance": 99,
    "deliveries": 100,
    "participation": "Alta",
    "evidence": "Apresenta ótimo desempenho e frequência, mas tem assumido várias tarefas para ajudar colegas que estão atrasados.",
    "context": "Diz que prefere “resolver logo” para o grupo não perder prazo."
  },
  {
    "id": "A18",
    "name": "Rafael",
    "age": 22,
    "attendance": 81,
    "deliveries": 72,
    "participation": "Média",
    "evidence": "Duas faltas, uma entrega parcial e menor participação nas últimas três aulas.",
    "context": "Perguntou recentemente quais seriam as consequências de faltar em mais encontros."
  },
  {
    "id": "A19",
    "name": "Sofia",
    "age": 20,
    "attendance": 95,
    "deliveries": 96,
    "participation": "Alta",
    "evidence": "Bom desempenho, mas relatou que o curso é diferente do que imaginava quando se matriculou.",
    "context": "Ainda assim, segue entregando e participando das atividades."
  },
  {
    "id": "A20",
    "name": "Thiago",
    "age": 19,
    "attendance": 89,
    "deliveries": 68,
    "participation": "Alta",
    "evidence": "Participa oralmente, propõe ideias, mas suas últimas duas entregas ficaram incompletas.",
    "context": "Demonstra entusiasmo no início das atividades e dificuldade para concluir etapas finais."
  },
  {
    "id": "A21",
    "name": "Úrsula",
    "age": 21,
    "attendance": 92,
    "deliveries": 93,
    "participation": "Média",
    "evidence": "Boa regularidade. Procurou o docente após a aula para perguntar se seu desempenho estava adequado.",
    "context": "Não há queda objetiva nos indicadores até agora."
  },
  {
    "id": "A22",
    "name": "Vinícius",
    "age": 18,
    "attendance": 83,
    "deliveries": 90,
    "participation": "Alta",
    "evidence": "Chegou atrasado em quatro encontros, mas entrega atividades e participa de forma consistente.",
    "context": "Relatou que depende de duas conexões de transporte para chegar ao curso."
  },
  {
    "id": "A23",
    "name": "Wesley",
    "age": 22,
    "attendance": 74,
    "deliveries": 58,
    "participation": "Baixa",
    "evidence": "Três faltas nas últimas semanas, duas atividades não entregues e pouca interação nas aulas recentes.",
    "context": "No primeiro mês do curso tinha participação média e frequência próxima de 90%."
  },
  {
    "id": "A24",
    "name": "Yasmin",
    "age": 19,
    "attendance": 97,
    "deliveries": 92,
    "participation": "Alta",
    "evidence": "Mantém bom desempenho. Começou a questionar por que determinadas atividades precisam ser feitas em grupo.",
    "context": "Costuma produzir bem individualmente e demonstra preferência por autonomia."
  },
  {
    "id": "A25",
    "name": "Arthur",
    "age": 20,
    "attendance": 86,
    "deliveries": 84,
    "participation": "Média",
    "evidence": "Teve dificuldade em acessar um recurso digital usado em duas aulas e ficou atrasado em uma etapa.",
    "context": "Após receber ajuda técnica, conseguiu retomar parte da atividade."
  },
  {
    "id": "A26",
    "name": "Beatriz",
    "age": 18,
    "attendance": 93,
    "deliveries": 77,
    "participation": "Média",
    "evidence": "Boa frequência, mas vem revisando excessivamente as tarefas e entregando perto do limite do prazo.",
    "context": "Pergunta repetidamente se a atividade está “boa o suficiente” antes de enviar."
  },
  {
    "id": "A27",
    "name": "Caio",
    "age": 21,
    "attendance": 80,
    "deliveries": 88,
    "participation": "Alta",
    "evidence": "Participa bem, porém já precisou sair mais cedo em três encontros.",
    "context": "Comentou que está conciliando o curso com compromissos profissionais variáveis."
  },
  {
    "id": "A28",
    "name": "Débora",
    "age": 20,
    "attendance": 96,
    "deliveries": 91,
    "participation": "Baixa",
    "evidence": "Presença alta e desempenho estável. Quase não participa das discussões abertas, mas contribui nos documentos do grupo.",
    "context": "Sua participação escrita é maior que a participação oral."
  },
  {
    "id": "A29",
    "name": "Enzo",
    "age": 19,
    "attendance": 88,
    "deliveries": 73,
    "participation": "Alta",
    "evidence": "Faz muitas perguntas e propõe caminhos, mas alterna entre períodos de grande envolvimento e pouca execução.",
    "context": "Mostra interesse em vários temas do curso ao mesmo tempo."
  },
  {
    "id": "A30",
    "name": "Fernanda",
    "age": 22,
    "attendance": 90,
    "deliveries": 86,
    "participation": "Média",
    "evidence": "Indicadores estáveis. Na última aula comentou que está reconsiderando seus próximos passos profissionais.",
    "context": "Ainda não houve alteração significativa em frequência ou entregas."
  }
];
