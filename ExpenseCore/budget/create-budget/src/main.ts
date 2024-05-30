import { ExpressAdapter } from "./infra/ExpressAdapter";

async function init() {
    const expressAdapter = new ExpressAdapter();




    const PORT =  process.env.PORT ? parseInt(process.env.PORT) : 4000;
    expressAdapter.listen(PORT, () => {console.log(`Rodando na porta ${PORT}`)});
}

init();