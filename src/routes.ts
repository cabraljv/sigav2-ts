import { Router } from 'express'

import { AuthenticationMiddleware } from './middlewares/auth'
import { CredencialService } from './services/credencial.service'
import { getConnection } from 'typeorm'
import { Credencial } from './models/credencial'
import { AlunoController } from './controllers/aluno.controller'
import { AlunoService } from './services/aluno.service'
import { Aluno } from './models/aluno'
import { ProfessorController } from './controllers/professor.controller'
import { Professor } from './models/professor'
import { ProfessorService } from './services/professor.service'
import { Matricula } from './models/matricula'
import { MatriculaController } from './controllers/matricula.controller'
import { MatriculaService } from './services/matricula.service'
import { AvaliacaoService } from './services/avaliacao.service'
import { AvaliacaoController } from './controllers/avaliacao.controller'
import { Avaliacao } from './models/avaliacao'
import { Disciplina } from './models/disciplina'
import { DisciplinaService } from './services/disciplina.service'
import { DisciplinaController } from './controllers/disciplina.controller'

const authenticationMiddleware = new AuthenticationMiddleware(
  new CredencialService(getConnection().getRepository(Credencial)),
)

const alunoController = new AlunoController(
  new AlunoService(getConnection().getRepository(Aluno)),
)
const professorController = new ProfessorController(
  new ProfessorService(getConnection().getRepository(Professor)),
)

const matriculaController = new MatriculaController(
  new MatriculaService(getConnection().getRepository(Matricula)),
)

const disciplinaController = new DisciplinaController(
  new DisciplinaService(getConnection().getRepository(Disciplina)),
)

const avaliacaoController = new AvaliacaoController(
  new AvaliacaoService(getConnection().getRepository(Avaliacao)),
)

const router = Router()

router.post('/login', authenticationMiddleware.authenticate)

router.use(authenticationMiddleware.authorize)

router.use('/alunos', alunoController.router)
router.use('/professores', professorController.router)
router.use('/matriculas', matriculaController.router)
router.use('/disciplinas', disciplinaController.router)
router.use('/avaliacoes', avaliacaoController.router)

export default router
