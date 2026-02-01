import { MissionDetailsClient } from './MissionDetailsClient';

export default async function MissionDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return <MissionDetailsClient missionId={id} />;
}
