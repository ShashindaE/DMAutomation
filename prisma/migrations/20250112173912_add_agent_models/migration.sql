/*
  Warnings:

  - The values [SMARTAI] on the enum `LISTENERS` will be removed. If these variants are still used in the database, this will fail.
  - The values [CAROSEL_ALBUM] on the enum `MEDIATYPE` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `automationId` on table `Keyword` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LISTENERS_new" AS ENUM ('MESSAGE', 'COMMENT');
ALTER TABLE "Listener" ALTER COLUMN "listener" DROP DEFAULT;
ALTER TABLE "Listener" ALTER COLUMN "listener" TYPE "LISTENERS_new" USING ("listener"::text::"LISTENERS_new");
ALTER TYPE "LISTENERS" RENAME TO "LISTENERS_old";
ALTER TYPE "LISTENERS_new" RENAME TO "LISTENERS";
DROP TYPE "LISTENERS_old";
ALTER TABLE "Listener" ALTER COLUMN "listener" SET DEFAULT 'MESSAGE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MEDIATYPE_new" AS ENUM ('IMAGE', 'VIDEO', 'CAROUSEL');
ALTER TABLE "Post" ALTER COLUMN "mediaType" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "mediaType" TYPE "MEDIATYPE_new" USING ("mediaType"::text::"MEDIATYPE_new");
ALTER TYPE "MEDIATYPE" RENAME TO "MEDIATYPE_old";
ALTER TYPE "MEDIATYPE_new" RENAME TO "MEDIATYPE";
DROP TYPE "MEDIATYPE_old";
ALTER TABLE "Post" ALTER COLUMN "mediaType" SET DEFAULT 'IMAGE';
COMMIT;

-- AlterTable
ALTER TABLE "Keyword" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "automationId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Workspace" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capabilities" TEXT[],
    "model" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "maxTokens" INTEGER NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "metricsPeriod" TEXT NOT NULL DEFAULT 'DAILY',
    "workspaceId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentConversation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "agentId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "automationId" UUID,
    "turns" JSONB[],
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "AgentConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentPerformanceMetrics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "agentId" UUID NOT NULL,
    "period" TEXT NOT NULL,
    "metrics" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentPerformanceMetrics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentConversation" ADD CONSTRAINT "AgentConversation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentConversation" ADD CONSTRAINT "AgentConversation_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentPerformanceMetrics" ADD CONSTRAINT "AgentPerformanceMetrics_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
