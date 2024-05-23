import { Auth } from './application/Auth';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { MainController } from './infra/MainController';
import { OpenTelemetrySDK } from './infra/OpenTelemetrySDK';
import { PostgresAdapter } from './infra/PostgresAdapter';
import { SpanAdapter } from './infra/SpanAdapter';
import { UserDatabase } from './infra/UserDatabase';

async function init() {
    new OpenTelemetrySDK();
    const spanAdapter = new SpanAdapter();
    const expressAdapter = new ExpressAdapter(spanAdapter);
    const database = new PostgresAdapter();
    await database.init();
    const repository = new UserDatabase(database);
    const usecase = new Auth(repository);
    new MainController(expressAdapter, usecase);

    expressAdapter.listen(6000, () => {console.log('Rodando na porta 6000')});
}

init();