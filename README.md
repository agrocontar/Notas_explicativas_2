# Notas_explicativas_2
Segunda versão do Notas Explicativas, utilizando Express + Prisma no backEnd e Next.js no front

Rodar Servidor back_end Em desenvolvimento

docker-compose up -d db        # sobe só o banco
npm run dev                    # roda app local com hot reload
npx prisma migrate dev         # aplica migrations
npx prisma studio              # interface web do DB


Rodar Servidor back_end em Prod

docker-compose -f docker-compose.yml up --build -d