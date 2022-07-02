import { Queues } from '../enums';
import BaseQueue from './base.queue';
import { Candidate } from '../entity/candidate.entity';
import Mysql from '../mysql';
import RedisCli from '../redis';

import { socketIo } from '../server';

const redis = RedisCli.getInstance();
export default class CandidataQueue extends BaseQueue {
  private static instance: CandidataQueue;

  public static getInstance(): CandidataQueue {
    if (!CandidataQueue.instance) {
      CandidataQueue.instance = new CandidataQueue();
    }

    return CandidataQueue.instance;
  }

  private constructor() {
    super(Queues.candidate);
    this.queue.process((data) => this.process(data));
  }

  private async process({ data }) {
    console.log(data);
    await this.createCandidate(data.name, data.partyNumber, data.photo);
  }

  private async createCandidate(
    name: string,
    partyNumber: number,
    photo: string,
  ) {
    console.log('Criando um novo candidato...');
    const candidate = new Candidate();
    candidate.name = name;
    candidate.partyNumber = partyNumber;
    candidate.photo = photo;
    await Mysql.manager.save(candidate);

    console.log(`Candidato ${name} - ${partyNumber} criado com sucesso`);

    const candidates = await Mysql.manager.find(Candidate);
    await redis.setJSON('candidates', candidates);
    this.emitSocket(candidates);
  }

  private emitSocket(candidates) {
    socketIo.emit('candidates', candidates);
    console.log('Candidatos enviado via socket');
  }
}
