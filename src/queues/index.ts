import VoteQueue from "./vote.queue";
import CandidataQueue from "./candidate.queue";
import LogQueue from "./console.queue";
import EmailQueue from "./email.queue";


LogQueue.getInstance();
EmailQueue.getInstance();
CandidataQueue.getInstance();
VoteQueue.getInstance();