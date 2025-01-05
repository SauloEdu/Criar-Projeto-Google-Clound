require('dotenv').config();
const { ProjectsClient } = require('@google-cloud/resource-manager').v3;
const express = require('express');
const app = express();
app.use(express.json()); // Para receber JSON no corpo da requisição

const port = process.env.PORT || 8080;

const createProject = async (organizationId, projectId, projectName) => {
    try {
        const client = new ProjectsClient({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS)
        });

        const project = {
            projectId: projectId,
            displayName: projectName,
            parent: `organizations/${organizationId}`,
        };

        const [operation] = await client.createProject({ project });
        console.log(`Operation in progress: ${operation.name}`);

        const [projectResponse] = await operation.promise();
        console.log(`Project ${projectId} created successfully.`);
        return projectResponse;


    } catch (error) {
        console.error(`Error creating project: ${error}`);
        throw error;
    }
};

app.post('/createProject', async (req, res) => {
    const { organizationId, projectId, projectName } = req.body;

    if (!organizationId || !projectId || !projectName) {
        return res.status(400).send('organizationId, projectId e projectName são obrigatórios.');
    }

    try {
        const project = await createProject(organizationId, projectId, projectName);
        res.status(201).json(project);
    } catch (error) {
        res.status(500).send('Erro ao criar o projeto');
    }
});

app.get('/', (req, res) => {
    res.send('API para criação de projetos do Google Cloud');
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});