import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { convertDate } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const bsMonthNames = [
  'Baisakh', 'Jestha', 'Asar', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

const adMonthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate range of years
const generateYearOptions = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const bsYears = generateYearOptions(2000, 2090);
const adYears = generateYearOptions(1944, 2033);

// Generate days (1-32 for BS, 1-31 for AD)
const bsDays = Array.from({ length: 32 }, (_, i) => i + 1);
const adDays = Array.from({ length: 31 }, (_, i) => i + 1);

const DateConverterForm = () => {
  // BS to AD conversion state
  const [bsYear, setBsYear] = useState<string>('2080');
  const [bsMonth, setBsMonth] = useState<string>('1'); // 1-indexed month
  const [bsDay, setBsDay] = useState<string>('1');
  
  // AD to BS conversion state
  const [adYear, setAdYear] = useState<string>('2024');
  const [adMonth, setAdMonth] = useState<string>('1'); // 1-indexed month
  const [adDay, setAdDay] = useState<string>('1');

  const [bsToAdTrigger, setBsToAdTrigger] = useState(false);
  const [adToBsTrigger, setAdToBsTrigger] = useState(false);

  // BS to AD conversion query
  const bsToAdQuery = useQuery({
    queryKey: ['/calendar/convert', { from: 'bs', date: `${bsYear}-${bsMonth}-${bsDay}` }],
    queryFn: () => convertDate({ from: 'bs', date: `${bsYear}-${bsMonth}-${bsDay}` }),
    enabled: bsToAdTrigger
  });

  // AD to BS conversion query
  const adToBsQuery = useQuery({
    queryKey: ['/calendar/convert', { from: 'ad', date: `${adYear}-${adMonth}-${adDay}` }],
    queryFn: () => convertDate({ from: 'ad', date: `${adYear}-${adMonth}-${adDay}` }),
    enabled: adToBsTrigger
  });

  // Effects to reset triggers when query finishes
  useEffect(() => {
    if (bsToAdQuery.isSuccess || bsToAdQuery.isError) {
      setBsToAdTrigger(false);
    }
  }, [bsToAdQuery.isSuccess, bsToAdQuery.isError]);

  useEffect(() => {
    if (adToBsQuery.isSuccess || adToBsQuery.isError) {
      setAdToBsTrigger(false);
    }
  }, [adToBsQuery.isSuccess, adToBsQuery.isError]);

  const handleBsToAdConvert = () => {
    setBsToAdTrigger(true);
  };

  const handleAdToBsConvert = () => {
    setAdToBsTrigger(true);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BS to AD Conversion */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-4">BS to AD Conversion</h4>
          
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bs-year">Year (BS)</Label>
            <Select value={bsYear} onValueChange={setBsYear}>
              <SelectTrigger className="w-full" id="bs-year">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {bsYears.map(year => (
                  <SelectItem key={`bs-year-${year}`} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bs-month">Month (BS)</Label>
            <Select value={bsMonth} onValueChange={setBsMonth}>
              <SelectTrigger className="w-full" id="bs-month">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {bsMonthNames.map((month, index) => (
                  <SelectItem key={`bs-month-${index}`} value={(index + 1).toString()}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bs-day">Day (BS)</Label>
            <Select value={bsDay} onValueChange={setBsDay}>
              <SelectTrigger className="w-full" id="bs-day">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {bsDays.map(day => (
                  <SelectItem key={`bs-day-${day}`} value={day.toString()}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleBsToAdConvert} 
            className="w-full bg-gradient-to-r from-[#57c84d] to-[#83d475] text-white py-2 px-4 rounded-md hover:from-[#4ab640] hover:to-[#72c364] transition-colors"
            disabled={bsToAdQuery.isPending}
          >
            {bsToAdQuery.isPending ? 'Converting...' : 'Convert to AD'}
          </Button>
          
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-500">Result (AD):</p>
            <p className="font-medium">
              {bsToAdQuery.isError ? (
                <span className="text-red-500">Error converting date</span>
              ) : bsToAdQuery.data ? (
                `${bsToAdQuery.data.adMonth} ${bsToAdQuery.data.adDay}, ${bsToAdQuery.data.adYear}`
              ) : (
                'Conversion result will appear here'
              )}
            </p>
          </div>
        </div>
        
        {/* AD to BS Conversion */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-4">AD to BS Conversion</h4>
          
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ad-year">Year (AD)</Label>
            <Select value={adYear} onValueChange={setAdYear}>
              <SelectTrigger className="w-full" id="ad-year">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {adYears.map(year => (
                  <SelectItem key={`ad-year-${year}`} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ad-month">Month (AD)</Label>
            <Select value={adMonth} onValueChange={setAdMonth}>
              <SelectTrigger className="w-full" id="ad-month">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {adMonthNames.map((month, index) => (
                  <SelectItem key={`ad-month-${index}`} value={(index + 1).toString()}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ad-day">Day (AD)</Label>
            <Select value={adDay} onValueChange={setAdDay}>
              <SelectTrigger className="w-full" id="ad-day">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {adDays.map(day => (
                  <SelectItem key={`ad-day-${day}`} value={day.toString()}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleAdToBsConvert} 
            className="w-full bg-gradient-to-r from-[#57c84d] to-[#83d475] text-white py-2 px-4 rounded-md hover:from-[#4ab640] hover:to-[#72c364] transition-colors"
            disabled={adToBsQuery.isPending}
          >
            {adToBsQuery.isPending ? 'Converting...' : 'Convert to BS'}
          </Button>
          
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-500">Result (BS):</p>
            <p className="font-medium">
              {adToBsQuery.isError ? (
                <span className="text-red-500">Error converting date</span>
              ) : adToBsQuery.data ? (
                `${adToBsQuery.data.bsMonth} ${adToBsQuery.data.bsDay}, ${adToBsQuery.data.bsYear}`
              ) : (
                'Conversion result will appear here'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateConverterForm;
