import 'reflect-metadata';
import configs from '../configs';
import { DataSource } from 'typeorm';
import { Candidate } from '../entity/candidate.entity';
import { Vote } from '../entity/vote.entity';

const AppDataSource = new DataSource({
  ...(configs.mysql as any),
  synchronize: true,
  entities: [Candidate, Vote],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log('MYSQL conectado com sucesso');
  })
  .catch((error) => {
    console.error('Falha ao conectar ao MYSQL :(');
    console.error(error);
  });

export default AppDataSource;
