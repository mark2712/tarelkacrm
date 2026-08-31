"use client";

import Link from "next/link";
import {
    Flex,
    Box,
    Card,
    Heading,
    Text,
    Badge,
    Grid,
    Separator,
} from "@radix-ui/themes";
import {
    PersonIcon,
    SpeakerLoudIcon,
    PaperPlaneIcon,
    ArrowRightIcon,
    ExternalLinkIcon,
} from "@radix-ui/react-icons";

const projects = [
    {
        title: "Google Contacts",
        href: "/google",
        description: "Управление контактами и интеграция с Google People API",
        badge: "Google API",
        badgeColor: "blue" as const,
        icon: <PersonIcon width="24" height="24" style={{ color: "var(--blue-9)" }} />,
    },
    {
        title: "Звукоизоляция",
        href: "/soundproofing",
        description: "Таблица заявок, фильтрация по датам и аналитика звукоизоляции",
        badge: "Заявки MSSS",
        badgeColor: "green" as const,
        icon: <SpeakerLoudIcon width="24" height="24" style={{ color: "var(--green-9)" }} />,
    },
    {
        title: "Трансфер",
        href: "/transfer",
        description: "Заказы и заявки трансфера, просмотр информации и статусов",
        badge: "WayGo",
        badgeColor: "purple" as const,
        icon: <PaperPlaneIcon width="24" height="24" style={{ color: "var(--purple-9)" }} />,
    },
];

export default function HomePage() {
    return (
        <Box style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
            <Flex direction="column" gap="4" align="center" style={{ textAlign: "center", marginBottom: "32px" }}>
                <Badge size="2" color="indigo" variant="soft">
                    Тарелка CRM
                </Badge>
                <Heading size="7" weight="bold" style={{ color: "var(--gray-12)" }}>
                    Панель управления
                </Heading>
                <Text size="3" color="gray" style={{ maxWidth: 500 }}>
                    Выберите нужный раздел или проект CRM для работы с таблицами данных и API.
                </Text>
            </Flex>

            <Separator size="4" style={{ marginBottom: "32px" }} />

            <Grid columns={{ initial: "1", sm: "3" }} gap="4">
                {projects.map((project) => (
                    <Link
                        key={project.href}
                        href={project.href}
                        style={{ textDecoration: "none", display: "block" }}
                    >
                        <Card
                            size="2"
                            variant="surface"
                            style={{
                                height: "100%",
                                padding: "20px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                border: "1px solid var(--gray-5)",
                            }}
                            className="hover:shadow-md hover:border-indigo-400"
                        >
                            <Flex direction="column" justify="between" style={{ height: "100%" }} gap="3">
                                <Box>
                                    <Flex justify="between" align="center" mb="3">
                                        <Box
                                            style={{
                                                padding: "10px",
                                                borderRadius: "12px",
                                                backgroundColor: "var(--gray-3)",
                                                display: "inline-flex",
                                            }}
                                        >
                                            {project.icon}
                                        </Box>
                                        <Badge color={project.badgeColor} size="1" variant="soft">
                                            {project.badge}
                                        </Badge>
                                    </Flex>

                                    <Heading size="4" weight="bold" mb="1" style={{ color: "var(--gray-12)" }}>
                                        {project.title}
                                    </Heading>

                                    <Text size="2" color="gray">
                                        {project.description}
                                    </Text>
                                </Box>

                                <Flex align="center" gap="1" style={{ color: "var(--blue-9)", fontWeight: 500, fontSize: "13px" }}>
                                    <span>Перейти в раздел</span>
                                    <ArrowRightIcon width="14" height="14" />
                                </Flex>
                            </Flex>
                        </Card>
                    </Link>
                ))}
            </Grid>
        </Box>
    );
}
