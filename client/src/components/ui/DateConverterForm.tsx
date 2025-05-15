import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { convertADToBS, convertBSToAD } from '@/lib/nepaliDateConverter';

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

  // Conversion results
  const [bsToAdResult, setBsToAdResult] = useState<string>('Conversion result will appear here');
  const [adToBsResult, setAdToBsResult] = useState<string>('Conversion result will appear here');
  
  // Loading states
  const [bsToAdLoading, setBsToAdLoading] = useState(false);
  const [adToBsLoading, setAdToBsLoading] = useState(false);

  // Month names for display
  const nepaliMonthNames = [
    'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 
    'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 
    'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];
  
  const englishMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleBsToAdConvert = () => {
    setBsToAdLoading(true);
    
    try {
      // Convert BS to AD using the direct function
      const bsYearNum = parseInt(bsYear);
      const bsMonthNum = parseInt(bsMonth);
      const bsDayNum = parseInt(bsDay);
      
      const result = convertBSToAD(bsYearNum, bsMonthNum, bsDayNum);
      
      // Format the result
      const formattedResult = `${result.month_name} ${result.day}, ${result.year}`;
      setBsToAdResult(formattedResult);
    } catch (error) {
      setBsToAdResult('Error converting date. Please check your input.');
      console.error('BS to AD conversion error:', error);
    } finally {
      setBsToAdLoading(false);
    }
  };

  const handleAdToBsConvert = () => {
    setAdToBsLoading(true);
    
    try {
      // Convert AD to BS using the direct function
      const adYearNum = parseInt(adYear);
      const adMonthNum = parseInt(adMonth) - 1; // JS Date months are 0-indexed
      const adDayNum = parseInt(adDay);
      
      const adDate = new Date(adYearNum, adMonthNum, adDayNum);
      const result = convertADToBS(adDate);
      
      // Format the result
      const formattedResult = `${result.day} ${result.month_name} ${result.year}`;
      setAdToBsResult(formattedResult);
    } catch (error) {
      setAdToBsResult('Error converting date. Please check your input.');
      console.error('AD to BS conversion error:', error);
    } finally {
      setAdToBsLoading(false);
    }
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
            className="w-full bg-gradient-to-r from-[#57c84d] to-[#83d475] text-white py-2 px-4 rounded-md hover:from-[#4ab640] hover:to-[#72c364] transition-colors cursor-pointer"
            disabled={bsToAdLoading}
            type="button"
          >
            {bsToAdLoading ? 'Converting...' : 'Convert to AD'}
          </Button>
          
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-500">Result (AD):</p>
            <p className="font-medium">
              {bsToAdResult}
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
            className="w-full bg-gradient-to-r from-[#57c84d] to-[#83d475] text-white py-2 px-4 rounded-md hover:from-[#4ab640] hover:to-[#72c364] transition-colors cursor-pointer"
            disabled={adToBsLoading}
            type="button"
          >
            {adToBsLoading ? 'Converting...' : 'Convert to BS'}
          </Button>
          
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-500">Result (BS):</p>
            <p className="font-medium">
              {adToBsResult}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateConverterForm;
