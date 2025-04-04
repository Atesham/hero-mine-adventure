import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectLists from "./ProjectLists";


import { toast } from 'sonner';
import {
    getUserReferrals,
    getReferralStats,
    generateReferralLink,
    getUserReferralCode
} from '@/services/referralService';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Users,
    Award,
    RefreshCw,
    Download,
    Search,
    Copy,
    Share,
    Link as LinkIcon,
    Gift,
    Zap,
    ChevronRight,
    Clock,
    UserPlus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';


// Sample crypto projects data
const cryptoProjects = [
    {
        id: '1',
        name: 'CoinX Airdrop',
        logo: '/coinx-logo.png',
        description: 'Free token distribution for early participants',
        type: 'airdrops',
        difficulty: 'Easy',
        estimatedEarnings: '$50-$200',
        timeRequired: '10 minutes',
        steps: [
            {
                title: 'Connect Wallet',
                description: 'Connect your wallet to the CoinX platform',
                action: {
                    type: 'link',
                    value: 'https://connect.coinx.com'
                }
            },
            {
                title: 'Complete KYC',
                description: 'Verify your identity',
            },
            {
                title: 'Hold Tokens',
                description: 'Hold 100 USDT for 7 days',
            }
        ]
    },
    {
        id: '2',
        name: 'ETH Staking Pool',
        logo: '/eth-logo.png',
        description: 'Earn rewards by staking ETH',
        type: 'staking',
        difficulty: 'Medium',
        estimatedEarnings: '5-8% APY',
        timeRequired: '5 minutes',
        steps: [
            {
                title: 'Deposit ETH',
                description: 'Transfer ETH to staking contract',
            },
            {
                title: 'Stake Tokens',
                description: 'Lock your ETH for rewards',
            }
        ]
    }
];

const EarnMore = () => {

    const [activeFilter, setActiveFilter] = useState<string>("all");
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'referral' | 'projects'>('referral');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [referrals, setReferrals] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, totalRewards: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [referralLink, setReferralLink] = useState('');
    const [error, setError] = useState<string | null>(null);

    const fetchReferrals = async () => {
        if (!user) {
            setLoading(false);
            setError("You must be logged in to view referrals");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const userReferrals = await getUserReferrals(user.uid);
            const referralStats = await getReferralStats(user.uid);
            const code = await getUserReferralCode(user.uid);
            setReferrals(userReferrals);
            setStats(referralStats);
            setReferralCode(code);

            if (code) {
                const link = generateReferralLink(code);
                setReferralLink(link);
            } else {
                console.error("No referral code returned");
                setError("Could not retrieve your referral code");
            }
        } catch (error: any) {
            console.error('Error fetching referrals:', error);
            setError(error.message || "Could not load referrals");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchReferrals();
    }, [user]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchReferrals();
    };

    const filteredReferrals = referrals.filter(ref =>
        ref.referredName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredProjects = cryptoProjects.filter(project =>
        activeFilter === 'all' || project.type === activeFilter
    );

    const copyReferralLink = () => {
        if (!referralLink) {
            toast.error('No referral link to copy');
            return;
        }

        navigator.clipboard.writeText(referralLink)
            .then(() => {
                toast.success('Referral link copied to clipboard!');
            })
            .catch((err) => {
                console.error('Failed to copy:', err);
                toast.error('Failed to copy referral link');
            });
    };

    const exportToCsv = () => {
        if (!referrals.length) return;

        const headers = ['Name', 'Date', 'Status', 'Reward'];
        const csvData = referrals.map(ref => [
            ref.referredName,
            new Date(ref.timestamp).toLocaleDateString(),
            ref.status,
            `${ref.rewardAmount || 25} coins`
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `referrals-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
                <Navbar />
                <main className="flex-1 py-10">
                    <div className="container px-4 mx-auto">
                        <div className="text-center py-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                                <Users className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-red-500">{error}</h3>
                            <Button onClick={handleRefresh} className="mt-4">
                                Try Again
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Navbar />
            <main className="flex-1 pt-16 pb-10">
                <div className="container px-4 mx-auto">
                    <div className="mb-8 mt-8">
                        {loading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-64" />
                                <Skeleton className="h-4 w-96" />
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold mb-2">Earn More</h1>
                                <p className="text-muted-foreground">
                                    Grow your earnings through referrals and crypto projects
                                </p>
                            </>
                        )}
                    </div>

                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value as 'referral' | 'projects')}
                        className="mb-8"
                    >
                        <TabsList className="grid w-full grid-cols-2 bg-muted h-12">
                            <TabsTrigger
                                value="referral"
                                className="data-[state=active]:bg-primary data-[state=active]:text-white"
                            >
                                <Gift className="w-4 h-4 mr-2" />
                                Referral Program
                            </TabsTrigger>
                            <TabsTrigger
                                value="projects"
                                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                Crypto Projects
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="referral">
                            {/* New Referral Rewards Highlight Section */}
                            <div className="mb-8 bg-gradient-to-r from-primary/5 to-purple-500/5 p-6 rounded-xl border border-primary/20">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                            Double Rewards Program
                                        </h3>
                                        <p className="text-muted-foreground mt-2">
                                            Earn together with your friends - both of you get bonuses!
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 min-w-max">
                                        {/* Referrer Reward */}
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border flex-1 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <Gift className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="text-2xl font-bold">50</span>
                                            </div>
                                            <p className="text-sm mt-2 font-medium">Your Reward</p>
                                            <p className="text-xs text-muted-foreground">per successful referral</p>
                                        </div>

                                        {/* Arrow separator */}
                                        <div className="hidden sm:flex items-center justify-center">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                                                <path d="M8 12H16M16 12L13 9M16 12L13 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>

                                        {/* Referee Reward */}
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border flex-1 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                                                    <UserPlus className="w-5 h-5 text-green-500" />
                                                </div>
                                                <span className="text-2xl font-bold">25</span>
                                            </div>
                                            <p className="text-sm mt-2 font-medium">Friend's Bonus</p>
                                            <p className="text-xs text-muted-foreground">when they sign up</p>
                                        </div>
                                    </div>
                                </div>


                            </div>

                            {/* Existing Referral Content */}
                            <Card className="mb-8">
                                <CardHeader className="pb-4">
                                    {loading ? (
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-48" />
                                            <Skeleton className="h-4 w-64" />
                                        </div>
                                    ) : (
                                        <>
                                            <CardTitle>Your Referral Link</CardTitle>
                                            <CardDescription>Share this link with friends to earn bonus coins</CardDescription>
                                        </>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="space-y-4">
                                            <div className="flex space-x-2">
                                                <Skeleton className="h-10 flex-1" />
                                                <Skeleton className="h-10 w-10" />
                                                <Skeleton className="h-10 w-10" />
                                            </div>
                                            <Skeleton className="h-4 w-48" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col space-y-4">
                                            <div className="flex space-x-2">
                                                <Input
                                                    value={referralLink}
                                                    readOnly
                                                    className="font-mono text-sm"
                                                    onClick={() => copyReferralLink()}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={copyReferralLink}
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                {navigator.share && (
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => navigator.share({
                                                            title: 'Join with my referral',
                                                            text: 'Sign up using my referral link!',
                                                            url: referralLink
                                                        })}
                                                        title="Share link"
                                                    >
                                                        <Share className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">Referral Code: <span className="font-mono">{referralCode}</span></span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {loading ? (
                                    <>
                                        <Skeleton className="h-32 rounded-xl" />
                                        <Skeleton className="h-32 rounded-xl" />
                                        <Skeleton className="h-32 rounded-xl" />
                                    </>
                                ) : (
                                    <>
                                        <div className="glass-card rounded-xl p-6 flex items-center">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                                                <Users className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Total Referrals</p>
                                                <p className="text-2xl font-bold">{stats.total}</p>
                                            </div>
                                        </div>

                                        <div className="glass-card rounded-xl p-6 flex items-center">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                                                <Award className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Total Rewards Earned</p>
                                                <p className="text-2xl font-bold">{stats.totalRewards} coins</p>
                                            </div>
                                        </div>

                                        <div className="glass-card rounded-xl p-6 flex items-center justify-between">
                                            <div className="flex space-x-2">
                                                <Button onClick={handleRefresh} variant="outline" size="sm" disabled={refreshing}>
                                                    {refreshing ? (
                                                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                                    ) : (
                                                        <RefreshCw className="h-4 w-4 mr-2" />
                                                    )}
                                                    Refresh
                                                </Button>

                                                <Button
                                                    onClick={exportToCsv}
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={!referrals.length}
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Export
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="glass-card rounded-xl overflow-hidden">
                                <div className="p-4 border-b">
                                    {loading ? (
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <Skeleton className="h-6 w-48" />
                                            <Skeleton className="h-10 w-64" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <h2 className="text-xl font-semibold">Referral History</h2>
                                            <div className="relative w-full md:w-64">
                                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search by name..."
                                                    className="pl-8"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {loading ? (
                                    <div className="p-6 space-y-4">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="flex items-center space-x-4">
                                                <Skeleton className="h-12 w-12 rounded-full" />
                                                <div className="space-y-2 flex-1">
                                                    <Skeleton className="h-4 w-3/4" />
                                                    <Skeleton className="h-4 w-1/2" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        {filteredReferrals.length > 0 ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>User</TableHead>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Reward</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredReferrals.map((referral) => (
                                                        <TableRow key={referral.id}>
                                                            <TableCell className="font-medium">
                                                                <div className="flex items-center">
                                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                                                        <Users className="w-4 h-4 text-primary" />
                                                                    </div>
                                                                    {referral.referredName}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {new Date(referral.timestamp).toLocaleDateString()} at{' '}
                                                                {new Date(referral.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${referral.status === 'completed'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {referral.status === 'completed' ? 'Completed' : 'Pending'}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="font-semibold text-primary">
                                                                    +{referral.rewardAmount || 25} coins
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <div className="text-center py-12">
                                                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                <h3 className="text-lg font-medium mb-2">
                                                    {searchTerm ? 'No matching referrals found' : 'No referrals yet'}
                                                </h3>
                                                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                                                    {searchTerm
                                                        ? 'Try a different search term or clear the search field'
                                                        : 'Invite your friends to join and start earning bonus coins!'}
                                                </p>
                                                {searchTerm && (
                                                    <Button variant="outline" onClick={() => setSearchTerm('')}>
                                                        Clear Search
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* <TabsContent value="projects">
                            <div className="mb-6">
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {['all', 'airdrops', 'staking'].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter as any)}
                                            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeFilter === filter
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {filter === 'all' ? 'All Projects' :
                                                filter === 'airdrops' ? 'Airdrops' : 'Staking'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map((project) => (
                                        <Card key={project.id}>
                                            <CardHeader className="pb-4">
                                                <div className="flex items-start gap-4">
                                                    <img
                                                        src={project.logo}
                                                        className="w-12 h-12 rounded-lg object-contain border"
                                                        alt={project.name}
                                                    />
                                                    <div>
                                                        <CardTitle className="flex items-center gap-2">
                                                            {project.name}
                                                            <span className={`text-xs px-2 py-1 rounded-full ${project.difficulty === 'Easy'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : project.difficulty === 'Medium'
                                                                        ? 'bg-amber-100 text-amber-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {project.difficulty}
                                                            </span>
                                                        </CardTitle>
                                                        <CardDescription>{project.description}</CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{project.timeRequired}</span>
                                                        <span>•</span>
                                                        <span className="font-medium text-green-600">
                                                            {project.estimatedEarnings}
                                                        </span>
                                                    </div>
                                                    <Button variant="outline" size="sm">
                                                        View Guide <ChevronRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium mb-2">
                                            No projects available
                                        </h3>
                                        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                                            Check back later for new earning opportunities
                                        </p>
                                    </div>
                                )}
                            </div>
                        </TabsContent> */}

                        <TabsContent value="projects">
                            {/* Crypto Projects Content */}
                            <div className="mb-6">
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {["all", "airdrops", "staking"].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter)}
                                            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeFilter === filter ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {filter === "all" ? "All Projects" : filter === "airdrops" ? "Airdrops" : "Staking"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Use ProjectList Component */}
                            <ProjectLists activeFilter={activeFilter} />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default EarnMore;