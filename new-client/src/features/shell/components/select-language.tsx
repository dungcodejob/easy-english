import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettingStore } from '@/stores';
import type { Language } from '@/types';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { RiGlobalLine } from '@remixicon/react';

const availableLanguages = [
  {
    code: 'en',
    name: 'English',
    icon: '/images/flags/en.svg',
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    icon: '/images/flags/vi.svg',
  },
];

function SelectLanguage() {
  const { language, setLanguage } = useSettingStore();

  const handleChangeLanguage = (value: Language) => {
    setLanguage(value);
  };

  return (
    <Select defaultValue={language} onValueChange={handleChangeLanguage}>
      <SelectTrigger className="pl-2.5">
        <SelectValue placeholder={<RiGlobalLine />} />
      </SelectTrigger>
      <SelectContent align="center">
        {availableLanguages.map((item) => (
          <SelectItem key={item.code} value={item.code}>
            <Avatar>
              <AvatarImage src={item.icon} />
            </Avatar>

            <span className="group-has-[&]/trigger:hidden">{item.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectLanguage;
