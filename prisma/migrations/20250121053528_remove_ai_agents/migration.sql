/*
  Warnings:

  - You are about to drop the `Agent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentConversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentPerformanceMetrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAQ` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResponseTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "AgentConversation" DROP CONSTRAINT "AgentConversation_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentConversation" DROP CONSTRAINT "AgentConversation_automationId_fkey";

-- DropForeignKey
ALTER TABLE "AgentPerformanceMetrics" DROP CONSTRAINT "AgentPerformanceMetrics_agentId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_agentId_fkey";

-- DropForeignKey
ALTER TABLE "FAQ" DROP CONSTRAINT "FAQ_agentId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_agentId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseTemplate" DROP CONSTRAINT "ResponseTemplate_agentId_fkey";

-- DropTable
DROP TABLE "Agent";

-- DropTable
DROP TABLE "AgentConversation";

-- DropTable
DROP TABLE "AgentPerformanceMetrics";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "FAQ";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "ResponseTemplate";

-- DropEnum
DROP TYPE "DOC_TYPE";

-- DropEnum
DROP TYPE "ORDER_STATUS";
