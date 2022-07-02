import { Queues } from '../enums';
import BaseQueue from './base.queue';
import Mysql from '../mysql';
import RedisCli from '../redis';
import { Vote } from '../entity/vote.entity';

const redis = RedisCli.getInstance();
import Transport from '../email';
import configs from '../configs';
import { Candidate } from '../entity/candidate.entity';
import { socketIo } from '../server';

export default class VoteQueue extends BaseQueue {
  private static instance: VoteQueue;

  public static getInstance(): VoteQueue {
    if (!VoteQueue.instance) {
      VoteQueue.instance = new VoteQueue();
    }

    return VoteQueue.instance;
  }

  private constructor() {
    super(Queues.vote);
    this.queue.process((data) => this.process(data));
  }

  private async process({ data }) {
    console.log(data);
    await this.saveVote(data.partyNumber);
  }

  private async saveVote(partyNumber: number) {
    console.log('Salvando novo voto...');
    const vote = new Vote();
    vote.partyNumber = partyNumber;
    await Mysql.manager.save(vote);

    console.log(`Voto ${partyNumber} salvo com sucesso`);

    const votes = await Mysql.manager.countBy(Vote, { partyNumber });
    await this.setVotes(partyNumber, votes);
    const candidate = await Mysql.manager
      .getRepository(Candidate)
      .findOneBy({ partyNumber: partyNumber });
    await this.sendEmailConfirmationVotes(candidate);
  }

  private async setVotes(partyNumber: number, votesQuantity: number) {
    let votes = await redis.getJSON('votes');
    if (votes === undefined) {
      votes = {};
    }
    if (!votes[partyNumber]) {
      votes[partyNumber] = 0;
    }

    votes[partyNumber] = votesQuantity;
    await redis.setJSON('votes', votes);
    this.emitSocket(votes);
  }

  private emitSocket(votes) {
    socketIo.emit('votes', votes);
    console.log('Votos enviado via socket');
  }

  private async sendEmailConfirmationVotes(candidate: Candidate) {
    await Transport.sendMail({
      to: configs.email.default.to,
      from: configs.email.default.from,
      subject: 'Voto Computado com sucesso!',
      html: `<html><img src='${candidate.photo}' width='200px'/><br /><b>Seu voto no candidatato ${candidate.name} do partido do número ${candidate.partyNumber} foi computado com sucesso</b></html>`,
    });
  }
}
