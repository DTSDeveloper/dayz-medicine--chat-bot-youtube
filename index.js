require('dotenv').config();
const { LiveChat } = require('youtube-chat');
const { default: axios } = require('axios');

// Substitua esta lista com os remédios e suas descrições
const medicineList = {
    // Sepsis (Blood Infection) Injection / Vials
    'topoisomerase': 'Sepsis',
    'sepsis+': 'Sepsis',
    'amoxivan vial/injector': 'Sepsis + Cold/Flu Level 3',
    'flemoklav': 'Sepsis + Cold/Flu Level 3',
    'imipenem': 'Sepsis + Cold/Flu Level 3',
    'oxacillin': 'Sepsis + Cold Flu Level 3',
  
    // Cold/Flu Pills / Chewables
    'amibactam': 'Cold/Flu Level 1',
    'trichopoli': 'Cold/Flu Level 1',
    'tsiprolet': 'Cold/Flu Level 1',
    'paracetamol': 'Cold/Flu Level 1 + Painkiller Level 1',
    'amoxiclav tablets': 'Cold/Flu Level 2',
    'amoxivan tablets': 'Cold/Flu Level 2',
    'erythromycin': 'Cold/Flu Level 2',
    'tetracycline': 'Cold/Flu Level 2',
    'ibuprofen': 'Cold/Flu Level 2 + Painkiller Level 1',
    'nurofen': 'Cold/Flu Level 2 + Painkiller Level 1',
    'ketorol': 'Cold/Flu Level 2 + Stomach Level 2 + Painkiller Level 1',
  
    // Cold/Flu Injection / Vials
    'ceftriaxone': 'Cold/Flu Level 2',
    'cilaspen': 'Cold/Flu Level 2',
  
    // Unverified
    'ampicillin': 'Cold/Flu Level 2 (Chew/Vial?)',
    'diclofenac': 'Cold/Flu Level 2 (Chew/Vial?)',
    'grimipenem': 'Cold/Flu Level 2 (Chew/Vial?)',
  
    // Stomach Issues Pills / Chewables
    'activated carbon': 'Stomach Level 1',
    'charcoal tablets': 'Stomach Level 1',
    'carbopect': 'Stomach Level 1',
    'cerucal tablet': 'Stomach Level 1',
    'ersefuril': 'Stomach Level 1',
    'enterofuril': 'Stomach Level 1',
    'mezim forte tablets': 'Stomach Level 1',
    'nifuroxazide': 'Stomach Level 1',
    'phthalazole': 'Stomach Level 1',
    'polysorb': 'Stomach Level 1',
    'mesalazine': 'Stomach Level 1',
    'salofalk': 'Stomach Level 1',
  
    // Stomach Issues Injection / Vials
    'cerucal vial': 'Stomach Level 2',
    'metoclopramide': 'Stomach Level 2',
    'heptral': 'Stomach Level 2',
  
    // Pain Killers Pills / Chewables
    'aertal': 'Painkiller Level 1',
    'analgin': 'Painkiller Level 1',
    'citramon': 'Painkiller Level 1',
    'movalis': 'Painkiller Level 1',
    'nimesil': 'Painkiller Level 1',
    'nise': 'Painkiller Level 1',
    'pentalgin': 'Painkiller Level 1',
    'noopept': 'Painkiller Level 1 + Concussions',
    'ketorol': 'Painkiller Level 1 + Cold/Flu Level 2 + Stomach Level 2',
  
    // Pain Killers Injection / Vials
    'hexobarbital': 'Painkiller Level 2',
    'irinex': 'Painkiller Level 2',
    'ketoprofen': 'Painkiller Level 2',
    'nimesulide': 'Painkiller Level 2',
    'novocaine': 'Painkiller Level 2',
    'propanidid': 'Painkiller Level 2',
    'ketamine': 'Painkiller Level 3',
    'promedol injector': 'Painkiller Level 3',
    'propofol': 'Painkiller Level 3',
    'sodium oxybate': 'Painkiller Level 3',
    'thiopental': 'Painkiller Level 3',
  
    // Concussion
    'noopept': 'Concussions + Painkiller Level 1',
    'actovegin': 'Concussions',
    'mexidol': 'Concussions',
    'neurox': 'Concussions',
  
    // Bruises Creams
    'finalgon': 'Bruises',
    'capsicam': 'Bruises',
    'paclitaxel-ebeve': 'Bruises',
    'viprosal': 'Bruises',
  
    // Blood Clotting Pills / Chewables
    'dicinon tablets': 'Blood Clotting',
    'vikasol': 'Blood Clotting',
    'sorbifer durules': 'Blood Regen + Clotting',
  
    // Blood Clotting Injection / Vials
    'aminocaproic acid': 'Blood Clotting',
    'etamsilat': 'Blood Clotting',
    'nonakog alpha': 'Blood Clotting',
    'erythropoietin': 'Blood Clotting + Regen',
  
    // Blood Regeneration Pills / Chewables
    'heferol': 'Blood Regen',
    'irovit': 'Blood Regen',
    'maltofer': 'Blood Regen',
    'tardiferon': 'Blood Regen',
  
    // Blood Regeneration Injection / Vials
    'perftoran': 'Blood Regen',
    
    // Anti-Depressants (Mental)
    'amitriptyline tablets': 'Mental Level 1',
    'venlafaxine': 'Mental Level 1',
    'agteminol': 'Mental Level 1',
    'actaparoxetine tablets': 'Mental Level 1',
    'amitriptyline vial': 'Mental Level 2',
  
    // Special/Other
    'alcohol': 'NEVER USE! Causes immediate overdose & death! Maybe use on a friend for the lols',
    'po-x antidote': 'Poison Gas',
    'epinephrine': 'Overdose/Heart Attack/Coma revival/More energy?',
    'diazion vial': 'Pesticide (NEVER USE ON SELF)',
    'arsenic vial': 'Lethal Poison (NEVER USE ON SELF)',
  };

async function startBot() {
  const liveChat = new LiveChat({
    channelId: process.env.CHANNEL_ID,
    apiKey: process.env.YOUTUBE_API_KEY,
  });

  liveChat.on('chat', (chatItem) => {
    const message = chatItem.message.toLowerCase();

    // Verifica se o comando !medicine foi usado
    if (message.startsWith('!medicine')) {
      const medicineName = message.split(' ')[1];

      // Busca o remédio na lista
      if (medicineList[medicineName]) {
        liveChat.sendMessage(`O remédio ${medicineName} é usado para: ${medicineList[medicineName]}`);
      } else {
        liveChat.sendMessage(`Desculpe, não encontrei informações para o remédio ${medicineName}.`);
      }
    }
  });

  liveChat.start();
}

startBot();