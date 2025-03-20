
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCodeIcon, CameraIcon, SendIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { sendCoins } from '@/services/transactionService';
import QrScanner from '@/components/wallet/QrScanner';

interface SendCoinsDialogProps {
  userId: string;
  balance: number;
  onSuccess: () => void;
}

const SendCoinsDialog = ({ userId, balance, onSuccess }: SendCoinsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'scan'>('form');
  const [sending, setSending] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  const amountRef = useRef<HTMLInputElement>(null);
  
  const handleScan = (data: string) => {
    if (data) {
      setRecipientAddress(data);
      setStep('form');
      
      // Focus the amount field after scan
      setTimeout(() => {
        if (amountRef.current) {
          amountRef.current.focus();
        }
      }, 100);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientAddress) {
      toast.error('Please enter a recipient address');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (parseFloat(amount) > balance) {
      toast.error('Insufficient balance');
      return;
    }
    
    try {
      setSending(true);
      await sendCoins(
        userId,
        recipientAddress,
        parseFloat(amount),
        description || 'Sent Hero Coins'
      );
      
      setIsOpen(false);
      setRecipientAddress('');
      setAmount('');
      setDescription('');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send coins');
    } finally {
      setSending(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center">
          <SendIcon className="h-4 w-4" />
          Send Coins
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle>Send Hero Coins</DialogTitle>
              <DialogDescription>
                Send Hero Coins to another user by entering their wallet address
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setStep('scan')}
                    className="h-7 px-2"
                  >
                    <QrCodeIcon className="h-4 w-4 mr-1" />
                    Scan QR
                  </Button>
                </div>
                <Input
                  id="recipient"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="HC-XXXXXXXX or User ID"
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  ref={amountRef}
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground">
                  Available balance: {balance} Hero Coins
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this payment for?"
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="submit" 
                  disabled={sending || !recipientAddress || !amount || parseFloat(amount) <= 0}
                  className="w-full"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <SendIcon className="h-4 w-4 mr-2" />
                      Send {amount ? `${amount} Hero Coins` : ''}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
              <DialogDescription>
                Point your camera at the recipient's Hero Coin QR code
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 flex flex-col items-center">
              <QrScanner onScan={handleScan} />
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setStep('form')}
              >
                Back to Form
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SendCoinsDialog;
