
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Users, Copy, Gift, UserPlus, ArrowRight, Link, Award, RefreshCw } from 'lucide-react';
import { getUserReferrals, generateReferralLink, getUserReferralCode, getReferralStats } from '@/services/referralService';
import { Link as RouterLink } from 'react-router-dom';
import inviteImage from '@/assets/invite.png';

interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  totalRewards: number;
}

const ReferralSection = () => {
  const { user } = useAuth();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReferralData = async () => {
    if (!user) {
      setLoading(false);
      setError("You must be logged in to see referral data");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching referral data for user:', user.uid);

      // Get user's referral code
      const code = await getUserReferralCode(user.uid);
      console.log('Retrieved referral code:', code);

      if (!code) {
        console.error("No referral code returned");
        setError("Could not retrieve your referral code");
        return;
      }

      // Get user's referrals
      const userReferrals = await getUserReferrals(user.uid);
      const stats = await getReferralStats(user.uid);

      setReferralData({
        referralCode: code,
        totalReferrals: stats.total,
        totalRewards: stats.totalRewards
      });

      setReferrals(userReferrals);

      // Generate referral link
      const link = generateReferralLink(code);
      console.log('Generated referral link:', link);
      setReferralLink(link);
    } catch (error: any) {
      console.error('Error fetching referral data:', error);
      setError(error.message || "Failed to load referral data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, [user]);

  const refreshReferrals = () => {
    setRefreshing(true);
    fetchReferralData();
  };

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

  const shareReferralLink = async () => {
    if (!referralLink) {
      toast.error('No referral link to share');
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Hero Coin',
          text: 'Sign up for Hero Coin using my referral link and get 10 free coins!',
          url: referralLink
        });
        toast.success('Referral link shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 animate-pulse">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Loading referral data...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
          <Users className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-red-500">{error}</h3>
        <Button onClick={refreshReferrals} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/10">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Refer Friends & Earn Together</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Invite your friends to join Hero Coin and both of you will earn bonus coins. You get 25 coins for each friend who joins!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-xl p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="md:w-1/3">



<div className="relative w-full max-w-[240px] mx-auto">
  {/* Outer Glow Effect - Crypto Themed */}
  <div className="absolute inset-0 rounded-full bg-gradient-to-r 
                  from-blue-500 via-indigo-600 to-purple-700 
                  blur-xl opacity-40"></div>

  {/* Dynamic Light Waves (Subtle Pulsing Effect) */}
  <div className="absolute inset-0 rounded-full opacity-30 
                  bg-radial-gradient(circle, rgba(0, 150, 255, 0.3) 15%, 
                  rgba(110, 80, 255, 0.15) 50%, 
                  transparent 80%) animate-pulse"></div>

  {/* Invite Image with Premium Styling */}
  <img
    src={inviteImage}
    alt="Invite Friends & Earn Rewards"
    className="relative w-full rounded-full border-2 border-blue-400 
               shadow-md shadow-indigo-500 p-2 bg-black/50 
               transition-transform transform hover:scale-105"
  />
</div>




              </div>

              <div className="md:w-2/3 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg bg-primary/5">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Gift className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">Your Reward</h3>
                    <p className="text-2xl font-bold text-primary">25 Coins</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-primary/5">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <UserPlus className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">Total Referrals</h3>
                    <p className="text-2xl font-bold text-primary">{referralData?.totalReferrals || 0}</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-primary/5">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">Friend's Reward</h3>
                    <p className="text-2xl font-bold text-primary">10 Coins</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Link className="h-5 w-5 text-primary" />
                    Your Referral Link
                    {referralData?.referralCode && (
                      <span className="text-sm font-mono bg-primary/10 px-2 py-1 rounded">
                        {referralData.referralCode}
                      </span>
                    )}
                  </h3>
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
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <Button onClick={shareReferralLink} className="flex-1">
                      Share Referral Link
                    </Button>
                    <Button variant="outline" onClick={refreshReferrals} disabled={refreshing} className="flex gap-2 items-center">
                      {refreshing ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      Refresh
                    </Button>
                    <Button variant="secondary" asChild>
                      <RouterLink to="/referrals">
                        View All Referrals
                      </RouterLink>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-4 bg-primary/5 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <span className="font-bold">1</span>
                  </div>
                  <p className="text-sm">Share your unique referral link with friends</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-primary/5 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <span className="font-bold">2</span>
                  </div>
                  <p className="text-sm">They sign up using your referral link</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-primary/5 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <span className="font-bold">3</span>
                  </div>
                  <p className="text-sm">Both of you receive bonus coins!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <Tabs defaultValue="referrals">
              <TabsList className="w-full">
                <TabsTrigger value="referrals" className="flex-1">Your Referrals</TabsTrigger>
              </TabsList>

              <TabsContent value="referrals" className="p-6">
                {referrals.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Recent Referrals</h3>
                      <Button asChild variant="outline" size="sm">
                        <RouterLink to="/referrals">
                          View All
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </RouterLink>
                      </Button>
                    </div>

                    {referrals.slice(0, 3).map((referral) => (
                      <div
                        key={referral.id}
                        className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{referral.referredName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(referral.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            +25 coins
                          </span>
                        </div>
                      </div>
                    ))}

                    {referrals.length > 3 && (
                      <div className="text-center mt-4">
                        <Button asChild variant="outline">
                          <RouterLink to="/referrals">
                            View All Referrals
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </RouterLink>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No referrals yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start inviting friends to earn bonus coins!
                    </p>
                    <Button onClick={shareReferralLink}>
                      Invite Friends
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralSection;
