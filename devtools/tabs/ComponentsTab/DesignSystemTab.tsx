'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  Input,
  TextArea,
  Label,
  Select,
  Checkbox,
  Radio,
  Badge,
  Progress,
  Spinner,
  Tooltip,
  Divider,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  Alert,
  Breadcrumbs,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Switch,
  Slider,
  ToastProvider,
  useToast,
  HelpPanel,
} from '@/components/ui';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from '@/components/ui/Dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/DropdownMenu';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/Popover';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  SheetClose,
} from '@/components/ui/Sheet';
import {
  DecorationDiv,
  DecorationGroup,
} from '@/components/ui';

// ============================================================================
// Section Component
// ============================================================================

function Section({ 
  title, 
  children, 
  variant = 'h3', 
  subsectionId, 
  className,
  'data-edit-scope': editScope,
  'data-component': component,
  ...rest 
}: { 
  title: string; 
  children: React.ReactNode; 
  variant?: 'h3' | 'h4'; 
  subsectionId?: string; 
  className?: string;
  'data-edit-scope'?: string;
  'data-component'?: string;
}) {
  const HeadingTag = variant === 'h4' ? 'h4' : 'h3';
  const hasMarginOverride = className?.includes('mb-');
  const isSubsection = variant === 'h4';
  const subsectionClasses = isSubsection ? 'p-4 border border-black bg-[var(--color-white)]' : '';
  const baseClasses = `${hasMarginOverride ? '' : 'mb-4'} ${subsectionClasses} rounded flex flex-col gap-4`.trim();
  return (
    <div 
      className={`${baseClasses} ${className || ''}`} 
      data-subsection-id={subsectionId}
      data-edit-scope={editScope}
      data-component={component}
      {...rest}
    >
      <HeadingTag>
        {title}
      </HeadingTag>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}

function PropsDisplay({ props }: { props: string }) {
  return (
    <code className="bg-black/5 px-2 py-1 rounded-sm block mt-2">
      {props}
    </code>
  );
}

function Row({ children, props }: {
  children: React.ReactNode;
  props?: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
      </div>
      {props && <PropsDisplay props={props} />}
    </div>
  );
}

// ============================================================================
// Accordion Content Components
// ============================================================================

// Loading button demo component
function LoadingButtonDemo() {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const handleClick1 = () => {
    setLoading1(true);
    setTimeout(() => setLoading1(false), 2000);
  };

  const handleClick2 = () => {
    setLoading2(true);
    setTimeout(() => setLoading2(false), 2000);
  };

  const handleClick3 = () => {
    setLoading3(true);
    setTimeout(() => setLoading3(false), 2000);
  };

  return (
    <>
      <Button 
        variant="primary" 
        size="md" 
        iconOnly={true} 
        iconName="refresh" 
        loading={loading1}
        onClick={handleClick1}
        data-edit-scope="component-definition"
        data-component="Button"
      >
        {''}
      </Button>
      <Button 
        variant="secondary" 
        size="md" 
        iconOnly={true} 
        iconName="download" 
        loading={loading2}
        onClick={handleClick2}
        data-edit-scope="component-definition"
        data-component="Button"
        data-edit-variant="secondary"
      >
        {''}
      </Button>
      <Button 
        variant="primary" 
        size="md" 
        iconName="copy" 
        loading={loading3}
        onClick={handleClick3}
        data-edit-scope="component-definition"
        data-component="Button"
      >
        Copy
      </Button>
    </>
  );
}

// Cycling spinner demo component
function CyclingSpinnerDemo({ size = 24 }: { size?: number }) {
  const [completed, setCompleted] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompleted(true);
      // After completion animation finishes (0.4s delay + 0.3s animation = ~0.7s), reset
      setTimeout(() => {
        setCompleted(false);
        // Force remount to reset animations
        setKey(prev => prev + 1);
      }, 800);
    }, 3000); // Cycle every 3 seconds (2s loading + 1s completion)

    return () => clearInterval(interval);
  }, []);

  return (
    <Spinner 
      key={key}
      size={size} 
      completed={completed}
      data-edit-scope="component-definition"
      data-component="Spinner"
    />
  );
}

function ButtonsContent() {
  return (
    <div className="space-y-6">
      <Section title="Button Variants" variant="h4" subsectionId="button-variants" className="mb-4">
        <Row props='variant="primary" | "secondary" | "outline" | "ghost"'>
          <Button variant="primary" size="md" fullWidth={false} iconOnly={false} data-edit-scope="component-definition" data-component="Button">Primary</Button>
          <Button variant="primary" size="md" fullWidth={false} iconOnly={false} disabled data-edit-scope="component-definition" data-component="Button">Disabled</Button>
        </Row>
        <Row props='variant="secondary"'>
          <Button variant="secondary" size="md" fullWidth={false} iconOnly={false} data-edit-scope="component-definition" data-component="Button" data-edit-variant="secondary">Secondary</Button>
          <Button variant="secondary" size="md" fullWidth={false} iconOnly={false} disabled data-edit-scope="component-definition" data-component="Button" data-edit-variant="secondary">Disabled</Button>
        </Row>
        <Row props='variant="outline"'>
          <Button variant="outline" size="md" fullWidth={false} iconOnly={false} data-edit-scope="component-definition" data-component="Button" data-edit-variant="outline">Outline</Button>
          <Button variant="outline" size="md" fullWidth={false} iconOnly={false} disabled data-edit-scope="component-definition" data-component="Button" data-edit-variant="outline">Disabled</Button>
        </Row>
        <Row props='variant="ghost"'>
          <Button variant="ghost" size="md" fullWidth={false} iconOnly={false} data-edit-scope="component-definition" data-component="Button" data-edit-variant="ghost">Ghost</Button>
          <Button variant="ghost" size="md" fullWidth={false} iconOnly={false} disabled data-edit-scope="component-definition" data-component="Button" data-edit-variant="ghost">Disabled</Button>
        </Row>
      </Section>

      <Section title="Button Sizes" variant="h4" subsectionId="button-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <Button variant="primary" size="sm" fullWidth={false} iconOnly={false}>Small</Button>
        </Row>
        <Row props='size="md"'>
          <Button variant="primary" size="md" fullWidth={false} iconOnly={false}>Medium</Button>
        </Row>
        <Row props='size="lg"'>
          <Button variant="primary" size="lg" fullWidth={false} iconOnly={false}>Large</Button>
        </Row>
      </Section>

      <Section title="Button with Icon" variant="h4" subsectionId="button-with-icon">
        <Row props='iconName="..."'>
          <Button variant="primary" size="md" iconName="copy" fullWidth={false} iconOnly={false} data-edit-scope="component-definition" data-component="Button">
            Download
          </Button>
          <Button variant="secondary" size="md" iconName="copy" fullWidth={false} iconOnly={false} data-edit-scope="component-definition" data-component="Button" data-edit-variant="secondary">
            Copy
          </Button>
        </Row>
        <Row props='iconOnly={true} iconName="..."'>
          <Button variant="primary" size="md" iconOnly={true} iconName="close" fullWidth={false} data-edit-scope="component-definition" data-component="Button">{''}</Button>
          <Button variant="primary" size="md" iconOnly={true} iconName="copy" fullWidth={false} data-edit-scope="component-definition" data-component="Button">{''}</Button>
          <Button variant="primary" size="lg" iconOnly={true} iconName="copy" fullWidth={false} data-edit-scope="component-definition" data-component="Button">{''}</Button>
        </Row>
        <Row props='loading={boolean} (only applies to buttons with icons)'>
          <LoadingButtonDemo />
        </Row>
        <Row props='fullWidth={true}'>
          <div className="w-64">
            <Button variant="primary" size="md" fullWidth={true} iconOnly={false} data-edit-scope="component-definition" data-component="Button">Full Width Button</Button>
          </div>
        </Row>
      </Section>
    </div>
  );
}

function CardsContent() {
  const [showIconButton, setShowIconButton] = useState(true);
  const [showBottomButton, setShowBottomButton] = useState(true);

  return (
    <div className="space-y-6">
      <Section title="Card Variants" variant="h4" subsectionId="card-variants">
        <Row props='variant="default" | "dark" | "grey"'>
          <div className="grid grid-cols-1 gap-4 w-full">
            <Card 
              variant="default" 
              noPadding={false} 
              disableHover={showBottomButton}
              data-edit-scope="component-definition" 
              data-component="Card"
            >
              <div className="flex justify-between items-center">
                <small>Default Card</small>
                {showIconButton && (
                  <Button variant="primary" size="md" iconOnly={true} iconName="information-circle" />
                )}
              </div>
              <Divider className="my-4" />
              <h3>Default Card</h3>
              <p>
                White background with black text and neutral-1 hover
              </p>
              {showBottomButton && (
                <div className="mt-4">
                  <Button variant="primary" size="md" fullWidth={true} iconOnly={false} iconName="arrow-right">
                    Full Width Button
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </Row>
        <Row props='variant="dark" | "grey"'>
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <Card variant="dark" noPadding={false} data-edit-scope="component-definition" data-component="Card" data-edit-variant="dark">
              <p className="mb-2">Dark Card</p>
              <p>
                Black background with white border and shadow
              </p>
            </Card>
            <Card variant="grey" noPadding={false} data-edit-scope="component-definition" data-component="Card" data-edit-variant="grey">
              <p className="mb-2">Grey Card</p>
              <p>
                Grey background with black text and shadow
              </p>
            </Card>
          </div>
        </Row>
      </Section>

      <Section title="Card with Header/Footer" variant="h4" subsectionId="card-with-header-footer">
        <Row props='noPadding={true} className="max-w-md"'>
          <Card variant="default" noPadding={true} className="max-w-md" data-edit-scope="component-definition" data-component="Card">
            <CardHeader>
              <h4>Card Header</h4>
            </CardHeader>
            <CardBody>
              <p>
                This is the card body content. It can contain any elements.
              </p>
            </CardBody>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="md" fullWidth={false} iconOnly={false}>Cancel</Button>
              <Button variant="primary" size="md" fullWidth={false} iconOnly={false}>Confirm</Button>
            </CardFooter>
          </Card>
        </Row>
      </Section>
    </div>
  );
}

function FormsContent() {
  const [selectValue, setSelectValue] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchChecked, setSwitchChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="space-y-6">
      <Section title="Text Inputs" variant="h4" subsectionId="text-inputs">
        <Row props='size="md" error={false} fullWidth={true}'>
          <div className="max-w-md w-full">
            <Label htmlFor="input-default">Default Input</Label>
            <Input id="input-default" size="md" error={false} fullWidth={true} placeholder="Enter text..." data-edit-scope="component-definition" data-component="Input" />
          </div>
        </Row>
        <Row props='error={true} fullWidth={true}'>
          <div className="max-w-md w-full">
            <Label htmlFor="input-error" required>Error State</Label>
            <Input id="input-error" size="md" error={true} fullWidth={true} placeholder="Invalid input" data-edit-scope="component-definition" data-component="Input" />
          </div>
        </Row>
        <Row props='disabled fullWidth={true}'>
          <div className="max-w-md w-full">
            <Label htmlFor="input-disabled">Disabled</Label>
            <Input id="input-disabled" size="md" error={false} fullWidth={true} disabled placeholder="Disabled" data-edit-scope="component-definition" data-component="Input" />
          </div>
        </Row>
      </Section>

      <Section title="Dark Variant" variant="h4" subsectionId="input-dark-variant">
        <Row props='variant="dark" size="md" error={false} fullWidth={true}'>
          <div className="max-w-md w-full bg-black p-4">
            <Label htmlFor="input-dark-default" className="text-white">Default Dark Input</Label>
            <Input id="input-dark-default" variant="dark" size="md" error={false} fullWidth={true} placeholder="Enter text..." data-edit-scope="component-definition" data-component="Input" data-edit-variant="dark" />
          </div>
        </Row>
        <Row props='variant="dark" error={true} fullWidth={true}'>
          <div className="max-w-md w-full bg-black p-4">
            <Label htmlFor="input-dark-error" className="text-white" required>Error State</Label>
            <Input id="input-dark-error" variant="dark" size="md" error={true} fullWidth={true} placeholder="Invalid input" data-edit-scope="component-definition" data-component="Input" data-edit-variant="dark" />
          </div>
        </Row>
        <Row props='variant="dark" disabled fullWidth={true}'>
          <div className="max-w-md w-full bg-black p-4">
            <Label htmlFor="input-dark-disabled" className="text-white">Disabled</Label>
            <Input id="input-dark-disabled" variant="dark" size="md" error={false} fullWidth={true} disabled placeholder="Disabled" data-edit-scope="component-definition" data-component="Input" data-edit-variant="dark" />
          </div>
        </Row>
      </Section>

      <Section title="Input Sizes" variant="h4" subsectionId="input-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <div className="max-w-md w-full">
            <Label htmlFor="input-sm">Small</Label>
            <Input id="input-sm" size="sm" error={false} fullWidth={true} placeholder="Small" data-edit-scope="component-definition" data-component="Input" />
          </div>
        </Row>
        <Row props='size="md"'>
          <div className="max-w-md w-full">
            <Label htmlFor="input-md">Medium</Label>
            <Input id="input-md" size="md" error={false} fullWidth={true} placeholder="Medium" data-edit-scope="component-definition" data-component="Input" />
          </div>
        </Row>
        <Row props='size="lg"'>
          <div className="max-w-md w-full">
            <Label htmlFor="input-lg">Large</Label>
            <Input id="input-lg" size="lg" error={false} fullWidth={true} placeholder="Large" data-edit-scope="component-definition" data-component="Input" />
          </div>
        </Row>
      </Section>

      <Section title="TextArea" variant="h4" subsectionId="textarea">
        <Row props='error={false} fullWidth={true} rows={4}'>
          <div className="max-w-md w-full">
            <Label htmlFor="textarea">Description</Label>
            <TextArea id="textarea" error={false} fullWidth={true} rows={4} placeholder="Enter description..." data-edit-scope="component-definition" data-component="TextArea" />
          </div>
        </Row>
      </Section>

      <Section title="Select" variant="h4" subsectionId="select">
        <Row props='options={[...]} value={string} onChange={fn} placeholder="..." fullWidth={true}'>
          <div className="max-w-xs w-full">
            <Label htmlFor="select">Choose an option</Label>
            <Select
              options={[
                { value: 'option1', label: 'Option One' },
                { value: 'option2', label: 'Option Two' },
                { value: 'option3', label: 'Option Three' },
                { value: 'disabled', label: 'Disabled Option', disabled: true },
              ]}
              value={selectValue}
              onChange={setSelectValue}
              placeholder="Select..."
              fullWidth={true}
              data-edit-scope="component-definition"
              data-component="Select"
            />
          </div>
        </Row>
      </Section>

      <Section title="Checkbox & Radio" variant="h4" subsectionId="checkbox-radio">
        <Row props='label="..." checked={boolean} onChange={fn} disabled={boolean}'>
          <Checkbox
            label="Check me"
            checked={checkboxChecked}
            onChange={(e) => setCheckboxChecked(e.target.checked)}
            disabled={false}
            data-edit-scope="component-definition"
            data-component="Checkbox"
          />
          <Checkbox label="Disabled" checked={false} onChange={() => {}} disabled={true} data-edit-scope="component-definition" data-component="Checkbox" />
          <Checkbox label="Checked & Disabled" checked={true} onChange={() => {}} disabled={true} data-edit-scope="component-definition" data-component="Checkbox" />
        </Row>
        <Row props='name="..." value="..." label="..." checked={boolean} onChange={fn}'>
          <Radio
            name="radio-group"
            value="option1"
            label="Option 1"
            checked={radioValue === 'option1'}
            onChange={() => setRadioValue('option1')}
            data-edit-scope="component-definition"
            data-component="Radio"
          />
          <Radio
            name="radio-group"
            value="option2"
            label="Option 2"
            checked={radioValue === 'option2'}
            onChange={() => setRadioValue('option2')}
            data-edit-scope="component-definition"
            data-component="Radio"
          />
          <Radio
            name="radio-group"
            value="option3"
            label="Option 3"
            checked={radioValue === 'option3'}
            onChange={() => setRadioValue('option3')}
            data-edit-scope="component-definition"
            data-component="Radio"
          />
        </Row>
      </Section>

      <Section title="Switch" variant="h4" subsectionId="switch">
        <Row props='checked={boolean} onChange={fn} size="sm" | "md" | "lg" label="..." labelPosition="left" | "right"'>
          <Switch
            checked={switchChecked}
            onChange={setSwitchChecked}
            size="md"
            label="Enable notifications"
            labelPosition="right"
            data-edit-scope="component-definition"
            data-component="Switch"
          />
          <Switch
            checked={!switchChecked}
            onChange={() => setSwitchChecked(!switchChecked)}
            size="md"
            label="Disabled"
            labelPosition="right"
            disabled={true}
            data-edit-scope="component-definition"
            data-component="Switch"
          />
        </Row>
        <Row props='size="sm" | "md" | "lg"'>
          <Switch checked={true} onChange={() => {}} size="sm" data-edit-scope="component-definition" data-component="Switch" />
          <Switch checked={true} onChange={() => {}} size="md" data-edit-scope="component-definition" data-component="Switch" />
          <Switch checked={true} onChange={() => {}} size="lg" data-edit-scope="component-definition" data-component="Switch" />
        </Row>
        <Row props='labelPosition="left"'>
          <Switch
            checked={switchChecked}
            onChange={setSwitchChecked}
            size="md"
            label="Label on left"
            labelPosition="left"
            data-edit-scope="component-definition"
            data-component="Switch"
          />
        </Row>
      </Section>

      <Section title="Slider" variant="h4" subsectionId="slider">
        <Row props='value={number} onChange={fn} min={number} max={number} step={number} size="sm" | "md" | "lg" showValue={boolean} label="..."'>
          <div className="max-w-md w-full">
            <Slider
              value={sliderValue}
              onChange={setSliderValue}
              min={0}
              max={100}
              step={1}
              size="md"
              label="Volume"
              showValue={true}
              data-edit-scope="component-definition"
              data-component="Slider"
            />
          </div>
        </Row>
        <Row props='size="sm" | "md" | "lg"'>
          <div className="max-w-md w-full">
            <Slider value={30} onChange={() => {}} size="sm" showValue={true} data-edit-scope="component-definition" data-component="Slider" />
          </div>
        </Row>
        <Row props='size="md"'>
          <div className="max-w-md w-full">
            <Slider value={60} onChange={() => {}} size="md" showValue={true} data-edit-scope="component-definition" data-component="Slider" />
          </div>
        </Row>
        <Row props='size="lg"'>
          <div className="max-w-md w-full">
            <Slider value={80} onChange={() => {}} size="lg" showValue={true} data-edit-scope="component-definition" data-component="Slider" />
          </div>
        </Row>
        <Row props='disabled'>
          <div className="max-w-md w-full">
            <Slider value={50} onChange={() => {}} disabled={true} showValue={true} data-edit-scope="component-definition" data-component="Slider" />
          </div>
        </Row>
      </Section>
    </div>
  );
}

function FeedbackContent() {
  const { addToast } = useToast();

  return (
    <div className="space-y-6">
      <Section title="Alert" variant="h4" subsectionId="alert">
        <Row props='variant="default" | "success" | "warning" | "error" | "info" title="..." iconName="..." closable={boolean} onClose={fn}'>
          <div className="max-w-md w-full">
            <Alert variant="default" title="Default Alert" data-edit-scope="component-definition" data-component="Alert">
              This is a default alert message.
            </Alert>
          </div>
        </Row>
        <Row props='variant="success"'>
          <div className="max-w-md w-full">
            <Alert variant="success" title="Success" data-edit-scope="component-definition" data-component="Alert" data-edit-variant="success">
              Operation completed successfully!
            </Alert>
          </div>
        </Row>
        <Row props='variant="warning"'>
          <div className="max-w-md w-full">
            <Alert variant="warning" title="Warning" data-edit-scope="component-definition" data-component="Alert" data-edit-variant="warning">
              Please review this information carefully.
            </Alert>
          </div>
        </Row>
        <Row props='variant="error"'>
          <div className="max-w-md w-full">
            <Alert variant="error" title="Error" data-edit-scope="component-definition" data-component="Alert" data-edit-variant="error">
              Something went wrong. Please try again.
            </Alert>
          </div>
        </Row>
        <Row props='variant="info"'>
          <div className="max-w-md w-full">
            <Alert variant="info" title="Info" data-edit-scope="component-definition" data-component="Alert" data-edit-variant="info">
              Here&apos;s some helpful information for you.
            </Alert>
          </div>
        </Row>
        <Row props='iconName="..." (overrides variant default)'>
          <div className="max-w-md w-full">
            <Alert variant="success" title="Custom Icon" iconName="checkmark" data-edit-scope="component-definition" data-component="Alert" data-edit-variant="success">
              Using a custom icon instead of the variant default.
            </Alert>
          </div>
        </Row>
        <Row props='closable={true} onClose={fn}'>
          <div className="max-w-md w-full">
            <Alert
              variant="default"
              title="Closable Alert"
              closable={true}
              onClose={() => alert('Alert closed!')}
              data-edit-scope="component-definition"
              data-component="Alert"
            >
              This alert can be closed by clicking the X button.
            </Alert>
          </div>
        </Row>
        <Row props='No title'>
          <div className="max-w-md w-full">
            <Alert variant="default" data-edit-scope="component-definition" data-component="Alert">
              Alert without a title - just the message content.
            </Alert>
          </div>
        </Row>
      </Section>

      <Section title="Badge Variants" variant="h4" subsectionId="badge-variants">
        <Row props='variant="default" | "success" | "warning" | "error" | "info" size="md"'>
          <Badge variant="default" size="md" data-edit-scope="component-definition" data-component="Badge">Default</Badge>
          <Badge variant="success" size="md" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="success">Success</Badge>
          <Badge variant="warning" size="md" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="warning">Warning</Badge>
          <Badge variant="error" size="md" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="error">Error</Badge>
          <Badge variant="info" size="md" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="info">Info</Badge>
        </Row>
        <Row props='size="sm" | "md"'>
          <Badge variant="default" size="sm" data-edit-scope="component-definition" data-component="Badge">Small</Badge>
          <Badge variant="success" size="sm" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="success">Success</Badge>
          <Badge variant="error" size="sm" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="error">Error</Badge>
        </Row>
      </Section>

      <Section title="Progress" variant="h4" subsectionId="progress">
        <Row props='value={number} variant="default" size="md" showLabel={false}'>
          <div className="max-w-md w-full">
            <Label htmlFor="progress-default">Default (50%)</Label>
            <Progress value={50} variant="default" size="md" showLabel={false} data-edit-scope="component-definition" data-component="Progress" />
          </div>
        </Row>
        <Row props='variant="success"'>
          <div className="max-w-md w-full">
            <Label htmlFor="progress-success">Success (75%)</Label>
            <Progress value={75} variant="success" size="md" showLabel={false} data-edit-scope="component-definition" data-component="Progress" data-edit-variant="success" />
          </div>
        </Row>
        <Row props='variant="warning"'>
          <div className="max-w-md w-full">
            <Label htmlFor="progress-warning">Warning (25%)</Label>
            <Progress value={25} variant="warning" size="md" showLabel={false} data-edit-scope="component-definition" data-component="Progress" data-edit-variant="warning" />
          </div>
        </Row>
        <Row props='showLabel={true}'>
          <div className="max-w-md w-full">
            <Label htmlFor="progress-label">Error with Label</Label>
            <Progress value={90} variant="error" size="md" showLabel={true} data-edit-scope="component-definition" data-component="Progress" data-edit-variant="error" />
          </div>
        </Row>
      </Section>

      <Section title="Progress Sizes" variant="h4" subsectionId="progress-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <div className="max-w-md w-full">
            <Label htmlFor="progress-sm">Small</Label>
            <Progress value={60} variant="default" size="sm" showLabel={false} />
          </div>
        </Row>
        <Row props='size="md"'>
          <div className="max-w-md w-full">
            <Label htmlFor="progress-md">Medium</Label>
            <Progress value={60} variant="default" size="md" showLabel={false} />
          </div>
        </Row>
        <Row props='size="lg"'>
          <div className="max-w-md w-full">
            <Label htmlFor="progress-lg">Large</Label>
            <Progress value={60} variant="default" size="lg" showLabel={false} />
          </div>
        </Row>
      </Section>

      <Section title="Spinner" variant="h4" subsectionId="spinner">
        <Row props='size={number}'>
          <Spinner size={16} data-edit-scope="component-definition" data-component="Spinner" />
          <Spinner size={24} data-edit-scope="component-definition" data-component="Spinner" />
          <Spinner size={32} data-edit-scope="component-definition" data-component="Spinner" />
        </Row>
        <Row props='Cycling demo - automatically loops between loading and completed'>
          <CyclingSpinnerDemo size={24} />
        </Row>
      </Section>

      <Section title="Toast" variant="h4" subsectionId="toast">
        <Row props='useToast() hook - addToast({ title, description?, variant?, duration? })'>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="md"
             
              fullWidth={false}
              iconOnly={false}
              onClick={() => addToast({ title: 'Default Toast', variant: 'default' })}
            >
              Default Toast
            </Button>
            <Button
              variant="primary"
              size="md"
             
              fullWidth={false}
              iconOnly={false}
              onClick={() => addToast({ title: 'Success!', description: 'Operation completed successfully.', variant: 'success' })}
            >
              Success Toast
            </Button>
            <Button
              variant="primary"
              size="md"
             
              fullWidth={false}
              iconOnly={false}
              onClick={() => addToast({ title: 'Warning', description: 'Please review this carefully.', variant: 'warning' })}
            >
              Warning Toast
            </Button>
            <Button
              variant="primary"
              size="md"
             
              fullWidth={false}
              iconOnly={false}
              onClick={() => addToast({ title: 'Error', description: 'Something went wrong.', variant: 'error' })}
            >
              Error Toast
            </Button>
            <Button
              variant="primary"
              size="md"
             
              fullWidth={false}
              iconOnly={false}
              onClick={() => addToast({ title: 'Info', description: 'Here\'s some helpful information.', variant: 'info' })}
            >
              Info Toast
            </Button>
          </div>
        </Row>
      </Section>

      <Section title="Tooltip" variant="h4" subsectionId="tooltip">
        <Row props='content="..." position="top" | "bottom" | "left" | "right" size="sm" | "md" | "lg"'>
          <Tooltip content="Top tooltip" position="top" size="sm" data-edit-scope="component-definition" data-component="Tooltip">
            <Button variant="primary" size="md" fullWidth={false} iconOnly={false}>Top</Button>
          </Tooltip>
          <Tooltip content="Bottom tooltip" position="bottom" size="sm" data-edit-scope="component-definition" data-component="Tooltip">
            <Button variant="primary" size="md" fullWidth={false} iconOnly={false}>Bottom</Button>
          </Tooltip>
          <Tooltip content="Left tooltip" position="left" size="sm" data-edit-scope="component-definition" data-component="Tooltip">
            <Button variant="primary" size="md" fullWidth={false} iconOnly={false}>Left</Button>
          </Tooltip>
          <Tooltip content="Right tooltip" position="right" size="sm" data-edit-scope="component-definition" data-component="Tooltip">
            <Button variant="primary" size="md" fullWidth={false} iconOnly={false}>Right</Button>
          </Tooltip>
        </Row>
      </Section>
    </div>
  );
}

function NavigationContent() {
  return (
    <div className="space-y-6">
      <Section title="Accordion" variant="h4" subsectionId="accordion">
        <Row props='type="single" | "multiple" defaultValue={string | string[]} value={string | string[]} onValueChange={fn}'>
          <div className="max-w-md w-full">
            <Accordion type="single" defaultValue="item1" data-edit-scope="component-definition" data-component="Accordion">
              <AccordionItem value="item1">
                <AccordionTrigger>First Item</AccordionTrigger>
                <AccordionContent>
                  This is the content for the first accordion item. It can contain any elements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item2">
                <AccordionTrigger>Second Item</AccordionTrigger>
                <AccordionContent>
                  This is the content for the second accordion item. You can put any content here.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item3">
                <AccordionTrigger>Third Item</AccordionTrigger>
                <AccordionContent>
                  This is the content for the third accordion item. The accordion supports single or multiple open items.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Row>
        <Row props='type="multiple" defaultValue={["item1", "item2"]}'>
          <div className="max-w-md w-full">
            <Accordion type="multiple" defaultValue={["item1", "item2"]} data-edit-scope="component-definition" data-component="Accordion" data-edit-variant="multiple">
              <AccordionItem value="item1">
                <AccordionTrigger>Multiple - Item 1</AccordionTrigger>
                <AccordionContent>
                  In multiple mode, multiple items can be open at once.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item2">
                <AccordionTrigger>Multiple - Item 2</AccordionTrigger>
                <AccordionContent>
                  This item starts expanded when using defaultValue.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item3">
                <AccordionTrigger>Multiple - Item 3</AccordionTrigger>
                <AccordionContent>
                  You can open all items simultaneously in multiple mode.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Row>
      </Section>

      <Section title="Breadcrumbs" variant="h4" subsectionId="breadcrumbs">
        <Row props='items={[{ label: string, href?: string }]} separator={string}'>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '#' },
              { label: 'Products', href: '#' },
              { label: 'Electronics', href: '#' },
              { label: 'Current Page' },
            ]}
            data-edit-scope="component-definition"
            data-component="Breadcrumbs"
          />
        </Row>
        <Row props='separator="→"'>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '#' },
              { label: 'About', href: '#' },
              { label: 'Team' },
            ]}
            separator="→"
          />
        </Row>
        <Row props='separator="•"'>
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '#' },
              { label: 'Settings', href: '#' },
              { label: 'Profile' },
            ]}
            separator="•"
          />
        </Row>
        <Row props='Single item'>
          <Breadcrumbs items={[{ label: 'Home' }]} />
        </Row>
      </Section>

      <Section title="Tabs - Pill Variant" variant="h4" subsectionId="tabs-pill-variant">
        <Row props='variant="pill" | "line" defaultValue="tab1" iconName="..."'>
          <Card variant="default" noPadding={false} className="max-w-lg">
            <Tabs defaultValue="tab1" variant="pill" data-edit-scope="component-definition" data-component="Tabs">
              <TabList className="">
                <TabTrigger value="tab1" iconName="home" className="">Tab One</TabTrigger>
                <TabTrigger value="tab2" iconName="settings" className="">Tab Two</TabTrigger>
                <TabTrigger value="tab3" iconName="information-circle" className="">Tab Three</TabTrigger>
              </TabList>
              <TabContent value="tab1" className="mt-4">
                <p>Content for Tab One</p>
              </TabContent>
              <TabContent value="tab2" className="mt-4">
                <p>Content for Tab Two</p>
              </TabContent>
              <TabContent value="tab3" className="mt-4">
                <p>Content for Tab Three</p>
              </TabContent>
            </Tabs>
          </Card>
        </Row>
      </Section>

      <Section title="Tabs - Line Variant" variant="h4" subsectionId="tabs-line-variant">
        <Row props='variant="line" iconName="..."'>
          <Card variant="default" noPadding={false} className="max-w-lg">
            <Tabs defaultValue="tab1" variant="line" data-edit-scope="component-definition" data-component="Tabs" data-edit-variant="line">
              <TabList className="">
                <TabTrigger value="tab1" iconName="home" className="">First</TabTrigger>
                <TabTrigger value="tab2" iconName="settings" className="">Second</TabTrigger>
                <TabTrigger value="tab3" iconName="information-circle" className="">Third</TabTrigger>
              </TabList>
              <TabContent value="tab1" className="mt-4">
                <p>First tab content</p>
              </TabContent>
              <TabContent value="tab2" className="mt-4">
                <p>Second tab content</p>
              </TabContent>
              <TabContent value="tab3" className="mt-4">
                <p>Third tab content</p>
              </TabContent>
            </Tabs>
          </Card>
        </Row>
      </Section>

      <Section title="Dividers" variant="h4" subsectionId="dividers">
        <Row props='variant="solid" | "dashed" | "decorated" orientation="horizontal"'>
          <div className="w-full max-w-md">
            <Label htmlFor="divider-solid">Solid</Label>
            <Divider orientation="horizontal" variant="solid" data-edit-scope="component-definition" data-component="Divider" />
          </div>
        </Row>
        <Row props='variant="dashed"'>
          <div className="w-full max-w-md">
            <Label htmlFor="divider-dashed">Dashed</Label>
            <Divider orientation="horizontal" variant="dashed" data-edit-scope="component-definition" data-component="Divider" data-edit-variant="dashed" />
          </div>
        </Row>
        <Row props='variant="decorated"'>
          <div className="w-full max-w-md">
            <Label htmlFor="divider-decorated">Decorated</Label>
            <Divider orientation="horizontal" variant="decorated" data-edit-scope="component-definition" data-component="Divider" data-edit-variant="decorated" />
          </div>
        </Row>
      </Section>

      <Section title="Vertical Divider" variant="h4" subsectionId="vertical-divider">
        <Row props='orientation="vertical"'>
          <div className="flex items-center h-12 gap-4">
            <span className="font-alfacad text-base">Left</span>
            <Divider orientation="vertical" variant="solid" />
            <span className="font-alfacad text-base">Right</span>
          </div>
        </Row>
      </Section>
    </div>
  );
}

function DecorationsContent() {
  return (
    <div className="space-y-6">
      <Section title="DecorationDiv" variant="h4" subsectionId="decoration-div">
        <Row props='orientation="horizontal" | "vertical" top={string} bottom={string} left={string} right={string} width={string} height={string} bgColor={string} mixBlendMode="difference" | "multiply" | "screen" | "overlay" | "normal" transform={string}'>
          <div className="relative h-32 w-full border border-black p-4">
            <DecorationDiv 
              orientation="horizontal" 
              top="15%" 
              width="5rem"
              data-edit-scope="component-definition"
              data-component="DecorationDiv"
            />
            <p className="text-sm text-black/60 mt-2">Horizontal decoration at top 15%</p>
          </div>
        </Row>
        <Row props='orientation="vertical"'>
          <div className="relative h-32 w-full border border-black p-4">
            <DecorationDiv 
              orientation="vertical" 
              left={0}
              height="5rem"
              data-edit-scope="component-definition"
              data-component="DecorationDiv"
              data-edit-variant="vertical"
            />
            <p className="text-sm text-black/60 mt-2">Vertical decoration on left</p>
          </div>
        </Row>
        <Row props='Positioning props'>
          <div className="relative h-32 w-full border border-black p-4">
            <DecorationDiv 
              orientation="horizontal" 
              top="25%"
              right="10%"
              width="3rem"
              data-edit-scope="component-definition"
              data-component="DecorationDiv"
            />
            <DecorationDiv 
              orientation="vertical" 
              bottom="10%"
              right="20%"
              height="3rem"
              data-edit-scope="component-definition"
              data-component="DecorationDiv"
            />
            <p className="text-sm text-black/60 mt-2">Multiple decorations with different positions</p>
          </div>
        </Row>
        <Row props='mixBlendMode="difference"'>
          <div className="relative h-32 w-full border border-black bg-black p-4">
            <DecorationDiv 
              orientation="horizontal" 
              top="50%"
              width="5rem"
              mixBlendMode="difference"
              data-edit-scope="component-definition"
              data-component="DecorationDiv"
            />
            <p className="text-sm text-white/60 mt-2">Mix-blend-mode: difference</p>
          </div>
        </Row>
      </Section>

      <Section title="DecorationGroup" variant="h4" subsectionId="decoration-group">
        <Row props='orientation="horizontal" | "vertical" lineCount={number} lineGap={string} top={string} bottom={string} left={string} right={string}'>
          <div className="relative h-40 w-full border border-black p-4">
            <DecorationGroup
              orientation="horizontal"
              lineCount={3}
              top="10%"
              left={0}
              lineGap="1rem"
              lineTransform="translateX(-50%)"
              data-edit-scope="component-definition"
              data-component="DecorationGroup"
            />
            <p className="text-sm text-black/60 mt-2">Horizontal group with 3 lines</p>
          </div>
        </Row>
        <Row props='orientation="vertical"'>
          <div className="relative h-32 w-full border border-black p-4">
            <DecorationGroup
              orientation="vertical"
              lineCount={3}
              left={0}
              lineGap="1rem"
              data-edit-scope="component-definition"
              data-component="DecorationGroup"
              data-edit-variant="vertical"
            />
            <p className="text-sm text-black/60 mt-2">Vertical group with 3 lines</p>
          </div>
        </Row>
        <Row props='lineCount={5}'>
          <div className="relative h-48 w-full border border-black p-4">
            <DecorationGroup
              orientation="horizontal"
              lineCount={5}
              top="5%"
              right="10%"
              lineGap="0.5rem"
              data-edit-scope="component-definition"
              data-component="DecorationGroup"
            />
            <p className="text-sm text-black/60 mt-2">Group with 5 lines (max)</p>
          </div>
        </Row>
      </Section>
    </div>
  );
}

function OverlaysContent() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [helpPanelOpen, setHelpPanelOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Section title="Dialog" variant="h4" subsectionId="dialog">
        <Row props='open={boolean} onOpenChange={fn} defaultOpen={boolean}'>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen} data-edit-scope="component-definition" data-component="Dialog">
            <DialogTrigger asChild>
              <Button variant="primary" size="md" fullWidth={false} iconOnly={false}>
                Open Dialog
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a description of what the dialog does.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p>
                  Dialog content goes here. You can put any content in the body.
                </p>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost" size="md" fullWidth={false} iconOnly={false}>
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="primary" size="md" fullWidth={false} iconOnly={false}>
                    Confirm
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Row>
      </Section>

      <Section title="Dropdown Menu" variant="h4" subsectionId="dropdown-menu">
        <Row props='open={boolean} onOpenChange={fn} position="bottom-start" | "bottom-end" | "top-start" | "top-end"'>
          <DropdownMenu data-edit-scope="component-definition" data-component="DropdownMenu">
            <DropdownMenuTrigger asChild>
              <Button variant="primary" size="md" fullWidth={false} iconOnly={false}>
                Open Menu ▼
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => alert('Copy clicked!')} destructive={false} disabled={false}>
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert('Cut clicked!')} destructive={false} disabled={false}>
                Cut
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert('Paste clicked!')} destructive={false} disabled={false}>
                Paste
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert('Delete clicked!')} destructive={true} disabled={false}>
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert('Disabled item')} destructive={false} disabled={true}>
                Disabled Item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
      </Section>

      <Section title="Popover" variant="h4" subsectionId="popover">
        <Row props='open={boolean} onOpenChange={fn} position="top" | "bottom" | "left" | "right" align="start" | "center" | "end"'>
          <Popover data-edit-scope="component-definition" data-component="Popover">
            <PopoverTrigger asChild>
              <Button variant="primary" size="md" fullWidth={false} iconOnly={false}>
                Open Popover
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="font-space-mono text-xs uppercase mb-2">Popover Title</p>
              <p className="font-alfacad text-base text-black/70">
                This is popover content. It can contain any elements.
              </p>
            </PopoverContent>
          </Popover>
        </Row>
        <Row props='position="top"'>
          <Popover position="top" data-edit-scope="component-definition" data-component="Popover">
            <PopoverTrigger asChild>
              <Button variant="outline" size="md" fullWidth={false} iconOnly={false}>
                Top Popover
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <p>Popover appears above</p>
            </PopoverContent>
          </Popover>
        </Row>
      </Section>

      <Section title="Sheet" variant="h4" subsectionId="sheet">
        <Row props='open={boolean} onOpenChange={fn} side="left" | "right" | "top" | "bottom"'>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen} side="right" data-edit-scope="component-definition" data-component="Sheet">
            <SheetTrigger asChild>
              <Button variant="primary" size="md" fullWidth={false} iconOnly={false}>
                Open Sheet (Right)
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sheet Title</SheetTitle>
                <SheetDescription>
                  This is a description of the sheet content.
                </SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p>
                  Sheet content goes here. This is a slide-in panel from the right side.
                </p>
              </SheetBody>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="ghost" size="md" fullWidth={false} iconOnly={false}>
                    Cancel
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="primary" size="md" fullWidth={false} iconOnly={false}>
                    Save
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Row>
        <Row props='side="left"'>
          <Sheet side="left" data-edit-scope="component-definition" data-component="Sheet">
            <SheetTrigger asChild>
              <Button variant="outline" size="md" fullWidth={false} iconOnly={false}>
                Open Sheet (Left)
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Left Side Sheet</SheetTitle>
              </SheetHeader>
              <SheetBody>
                <p>Sheet slides in from the left</p>
              </SheetBody>
            </SheetContent>
          </Sheet>
        </Row>
      </Section>

      <Section title="Help Panel" variant="h4" subsectionId="help-panel">
        <Row props='isOpen={boolean} onClose={fn} title={string}'>
          <div className="relative w-full max-w-md h-64 border border-black rounded-sm bg-white overflow-hidden">
            <div className="p-4">
              <Button
                variant="primary"
                size="md"
               
                fullWidth={false}
                iconOnly={false}
                onClick={() => setHelpPanelOpen(true)}
              >
                Open Help Panel
              </Button>
            </div>
            <HelpPanel
              isOpen={helpPanelOpen}
              onClose={() => setHelpPanelOpen(false)}
              title="Help"
              data-edit-scope="component-definition"
              data-component="HelpPanel"
            >
              <div>
                <p className="font-space-mono text-xs uppercase mb-2">Help Content</p>
                <p className="mb-4">
                  This is a contextual help panel that slides in from the right side of its container.
                </p>
                <p>
                  It&apos;s useful for providing contextual help within app windows or modals.
                </p>
              </div>
            </HelpPanel>
          </div>
        </Row>
      </Section>

      <Section title="Context Menu" variant="h4" subsectionId="context-menu">
        <Row props='onClick={fn} destructive={boolean} disabled={boolean}'>
              <p className="mb-4 w-full">
            Right-click on the card below to see the context menu:
          </p>
          <ContextMenu data-edit-scope="component-definition" data-component="ContextMenu">
            <Card variant="default" noPadding={false} className="max-w-xs cursor-context-menu">
              <p className="font-space-mono text-xs mb-2">Right-click me!</p>
              <p className="font-alfacad text-base text-black/70">
                This card has a context menu attached.
              </p>
            </Card>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => alert('Copy clicked!')} destructive={false} disabled={false}>
                Copy
              </ContextMenuItem>
              <ContextMenuItem onClick={() => alert('Paste clicked!')} destructive={false} disabled={false}>
                Paste
              </ContextMenuItem>
              <ContextMenuItem onClick={() => alert('Duplicate clicked!')} destructive={false} disabled={false}>
                Duplicate
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => alert('Delete clicked!')} destructive={true} disabled={false}>
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Search Index
// ============================================================================

export interface SearchableItem {
  text: string;
  sectionId: string;
  subsectionTitle?: string;
  type: 'section' | 'subsection' | 'button' | 'label' | 'checkbox' | 'radio' | 'switch' | 'slider' | 'badge' | 'alert' | 'toast' | 'tooltip' | 'breadcrumb' | 'tab' | 'divider' | 'menu' | 'decoration';
}

export const SEARCH_INDEX: SearchableItem[] = [
  // Buttons section
  { text: 'Buttons', sectionId: 'buttons', type: 'section' },
  { text: 'Button Variants', sectionId: 'buttons', subsectionTitle: 'Button Variants', type: 'subsection' },
  { text: 'Button Sizes', sectionId: 'buttons', subsectionTitle: 'Button Sizes', type: 'subsection' },
  { text: 'Button with Icon', sectionId: 'buttons', subsectionTitle: 'Button with Icon', type: 'subsection' },
  { text: 'Primary', sectionId: 'buttons', type: 'button' },
  { text: 'Secondary', sectionId: 'buttons', type: 'button' },
  { text: 'Outline', sectionId: 'buttons', type: 'button' },
  { text: 'Ghost', sectionId: 'buttons', type: 'button' },
  { text: 'Disabled', sectionId: 'buttons', type: 'button' },
  { text: 'Small', sectionId: 'buttons', type: 'button' },
  { text: 'Medium', sectionId: 'buttons', type: 'button' },
  { text: 'Large', sectionId: 'buttons', type: 'button' },
  { text: 'Download', sectionId: 'buttons', type: 'button' },
  { text: 'Copy', sectionId: 'buttons', type: 'button' },
  { text: 'Full Width Button', sectionId: 'buttons', type: 'button' },
  
  // Cards section
  { text: 'Cards', sectionId: 'cards', type: 'section' },
  { text: 'Card Variants', sectionId: 'cards', subsectionTitle: 'Card Variants', type: 'subsection' },
  { text: 'Card with Header/Footer', sectionId: 'cards', subsectionTitle: 'Card with Header/Footer', type: 'subsection' },
  { text: 'Default Card', sectionId: 'cards', type: 'label' },
  { text: 'Blue Card', sectionId: 'cards', type: 'label' },
  { text: 'Green Card', sectionId: 'cards', type: 'label' },
  { text: 'Dark Card', sectionId: 'cards', type: 'label' },
  { text: 'Grey Card', sectionId: 'cards', type: 'label' },
  { text: 'Card Header', sectionId: 'cards', type: 'label' },
  { text: 'Cancel', sectionId: 'cards', type: 'button' },
  { text: 'Confirm', sectionId: 'cards', type: 'button' },
  
  // Forms section
  { text: 'Forms', sectionId: 'forms', type: 'section' },
  { text: 'Text Inputs', sectionId: 'forms', subsectionTitle: 'Text Inputs', type: 'subsection' },
  { text: 'Input Sizes', sectionId: 'forms', subsectionTitle: 'Input Sizes', type: 'subsection' },
  { text: 'TextArea', sectionId: 'forms', subsectionTitle: 'TextArea', type: 'subsection' },
  { text: 'Select', sectionId: 'forms', subsectionTitle: 'Select', type: 'subsection' },
  { text: 'Checkbox & Radio', sectionId: 'forms', subsectionTitle: 'Checkbox & Radio', type: 'subsection' },
  { text: 'Switch', sectionId: 'forms', subsectionTitle: 'Switch', type: 'subsection' },
  { text: 'Slider', sectionId: 'forms', subsectionTitle: 'Slider', type: 'subsection' },
  { text: 'Default Input', sectionId: 'forms', type: 'label' },
  { text: 'Error State', sectionId: 'forms', type: 'label' },
  { text: 'Description', sectionId: 'forms', type: 'label' },
  { text: 'Choose an option', sectionId: 'forms', type: 'label' },
  { text: 'Check me', sectionId: 'forms', type: 'checkbox' },
  { text: 'Checked & Disabled', sectionId: 'forms', type: 'checkbox' },
  { text: 'Option 1', sectionId: 'forms', type: 'radio' },
  { text: 'Option 2', sectionId: 'forms', type: 'radio' },
  { text: 'Option 3', sectionId: 'forms', type: 'radio' },
  { text: 'Enable notifications', sectionId: 'forms', type: 'switch' },
  { text: 'Label on left', sectionId: 'forms', type: 'switch' },
  { text: 'Volume', sectionId: 'forms', type: 'slider' },
  { text: 'Default (50%)', sectionId: 'forms', type: 'label' },
  { text: 'Success (75%)', sectionId: 'forms', type: 'label' },
  { text: 'Warning (25%)', sectionId: 'forms', type: 'label' },
  { text: 'Error with Label', sectionId: 'forms', type: 'label' },
  
  // Feedback section
  { text: 'Feedback', sectionId: 'feedback', type: 'section' },
  { text: 'Alert', sectionId: 'feedback', subsectionTitle: 'Alert', type: 'subsection' },
  { text: 'Badge Variants', sectionId: 'feedback', subsectionTitle: 'Badge Variants', type: 'subsection' },
  { text: 'Progress', sectionId: 'feedback', subsectionTitle: 'Progress', type: 'subsection' },
  { text: 'Progress Sizes', sectionId: 'feedback', subsectionTitle: 'Progress Sizes', type: 'subsection' },
  { text: 'Spinner', sectionId: 'feedback', subsectionTitle: 'Spinner', type: 'subsection' },
  { text: 'Toast', sectionId: 'feedback', subsectionTitle: 'Toast', type: 'subsection' },
  { text: 'Tooltip', sectionId: 'feedback', subsectionTitle: 'Tooltip', type: 'subsection' },
  { text: 'Default Alert', sectionId: 'feedback', type: 'alert' },
  { text: 'Success', sectionId: 'feedback', type: 'alert' },
  { text: 'Warning', sectionId: 'feedback', type: 'alert' },
  { text: 'Error', sectionId: 'feedback', type: 'alert' },
  { text: 'Info', sectionId: 'feedback', type: 'alert' },
  { text: 'Closable Alert', sectionId: 'feedback', type: 'alert' },
  { text: 'Default Toast', sectionId: 'feedback', type: 'toast' },
  { text: 'Success Toast', sectionId: 'feedback', type: 'toast' },
  { text: 'Warning Toast', sectionId: 'feedback', type: 'toast' },
  { text: 'Error Toast', sectionId: 'feedback', type: 'toast' },
  { text: 'Info Toast', sectionId: 'feedback', type: 'toast' },
  { text: 'Top', sectionId: 'feedback', type: 'tooltip' },
  { text: 'Bottom', sectionId: 'feedback', type: 'tooltip' },
  { text: 'Left', sectionId: 'feedback', type: 'tooltip' },
  { text: 'Right', sectionId: 'feedback', type: 'tooltip' },
  
  // Navigation section
  { text: 'Navigation', sectionId: 'navigation', type: 'section' },
  { text: 'Accordion', sectionId: 'navigation', subsectionTitle: 'Accordion', type: 'subsection' },
  { text: 'First Item', sectionId: 'navigation', type: 'label' },
  { text: 'Second Item', sectionId: 'navigation', type: 'label' },
  { text: 'Third Item', sectionId: 'navigation', type: 'label' },
  { text: 'Multiple', sectionId: 'navigation', type: 'label' },
  { text: 'Breadcrumbs', sectionId: 'navigation', subsectionTitle: 'Breadcrumbs', type: 'subsection' },
  { text: 'Tabs - Pill Variant', sectionId: 'navigation', subsectionTitle: 'Tabs - Pill Variant', type: 'subsection' },
  { text: 'Tabs - Line Variant', sectionId: 'navigation', subsectionTitle: 'Tabs - Line Variant', type: 'subsection' },
  { text: 'Dividers', sectionId: 'navigation', subsectionTitle: 'Dividers', type: 'subsection' },
  { text: 'Vertical Divider', sectionId: 'navigation', subsectionTitle: 'Vertical Divider', type: 'subsection' },
  { text: 'Home', sectionId: 'navigation', type: 'breadcrumb' },
  { text: 'Products', sectionId: 'navigation', type: 'breadcrumb' },
  { text: 'Electronics', sectionId: 'navigation', type: 'breadcrumb' },
  { text: 'Current Page', sectionId: 'navigation', type: 'breadcrumb' },
  { text: 'About', sectionId: 'navigation', type: 'breadcrumb' },
  { text: 'Team', sectionId: 'navigation', type: 'breadcrumb' },
  { text: 'Dashboard', sectionId: 'navigation', type: 'breadcrumb' },
  { text: 'Settings', sectionId: 'navigation', type: 'breadcrumb' },
  { text: 'Profile', sectionId: 'navigation', type: 'breadcrumb' },
  { text: 'Tab One', sectionId: 'navigation', type: 'tab' },
  { text: 'Tab Two', sectionId: 'navigation', type: 'tab' },
  { text: 'Tab Three', sectionId: 'navigation', type: 'tab' },
  { text: 'First', sectionId: 'navigation', type: 'tab' },
  { text: 'Second', sectionId: 'navigation', type: 'tab' },
  { text: 'Third', sectionId: 'navigation', type: 'tab' },
  { text: 'Solid', sectionId: 'navigation', type: 'divider' },
  { text: 'Dashed', sectionId: 'navigation', type: 'divider' },
  { text: 'Decorated', sectionId: 'navigation', type: 'divider' },
  
  // Decorations section
  { text: 'Decorations', sectionId: 'decorations', type: 'section' },
  { text: 'DecorationDiv', sectionId: 'decorations', subsectionTitle: 'DecorationDiv', type: 'subsection' },
  { text: 'DecorationGroup', sectionId: 'decorations', subsectionTitle: 'DecorationGroup', type: 'subsection' },
  { text: 'Horizontal', sectionId: 'decorations', type: 'decoration' },
  { text: 'Vertical', sectionId: 'decorations', type: 'decoration' },
  { text: 'Mix Blend Mode', sectionId: 'decorations', type: 'decoration' },
  
  // Overlays section
  { text: 'Overlays', sectionId: 'overlays', type: 'section' },
  { text: 'Dialog', sectionId: 'overlays', subsectionTitle: 'Dialog', type: 'subsection' },
  { text: 'Dropdown Menu', sectionId: 'overlays', subsectionTitle: 'Dropdown Menu', type: 'subsection' },
  { text: 'Popover', sectionId: 'overlays', subsectionTitle: 'Popover', type: 'subsection' },
  { text: 'Sheet', sectionId: 'overlays', subsectionTitle: 'Sheet', type: 'subsection' },
  { text: 'Help Panel', sectionId: 'overlays', subsectionTitle: 'Help Panel', type: 'subsection' },
  { text: 'Context Menu', sectionId: 'overlays', subsectionTitle: 'Context Menu', type: 'subsection' },
  { text: 'Open Dialog', sectionId: 'overlays', type: 'button' },
  { text: 'Open Menu', sectionId: 'overlays', type: 'button' },
  { text: 'Open Popover', sectionId: 'overlays', type: 'button' },
  { text: 'Top Popover', sectionId: 'overlays', type: 'button' },
  { text: 'Open Sheet (Right)', sectionId: 'overlays', type: 'button' },
  { text: 'Open Sheet (Left)', sectionId: 'overlays', type: 'button' },
  { text: 'Open Help Panel', sectionId: 'overlays', type: 'button' },
  { text: 'Save', sectionId: 'overlays', type: 'button' },
  { text: 'Actions', sectionId: 'overlays', type: 'menu' },
  { text: 'Cut', sectionId: 'overlays', type: 'menu' },
  { text: 'Paste', sectionId: 'overlays', type: 'menu' },
  { text: 'Duplicate', sectionId: 'overlays', type: 'menu' },
  { text: 'Disabled Item', sectionId: 'overlays', type: 'menu' },
];

// Section title lookup map
const SECTION_TITLES: Record<string, string> = {
  buttons: 'Buttons',
  cards: 'Cards',
  forms: 'Forms',
  feedback: 'Feedback',
  navigation: 'Navigation',
  decorations: 'Decorations',
  overlays: 'Overlays',
};

// Subsection title to ID mapping
const SUBSECTION_ID_MAP: Record<string, string> = {
  'Button Variants': 'button-variants',
  'Button Sizes': 'button-sizes',
  'Button with Icon': 'button-with-icon',
  'Card Variants': 'card-variants',
  'Card with Header/Footer': 'card-with-header-footer',
  'Text Inputs': 'text-inputs',
  'Input Sizes': 'input-sizes',
  'TextArea': 'textarea',
  'Select': 'select',
  'Checkbox & Radio': 'checkbox-radio',
  'Switch': 'switch',
  'Slider': 'slider',
  'Alert': 'alert',
  'Badge Variants': 'badge-variants',
  'Progress': 'progress',
  'Progress Sizes': 'progress-sizes',
  'Spinner': 'spinner',
  'Toast': 'toast',
  'Tooltip': 'tooltip',
  'Accordion': 'accordion',
  'Breadcrumbs': 'breadcrumbs',
  'Tabs - Pill Variant': 'tabs-pill-variant',
  'Tabs - Line Variant': 'tabs-line-variant',
  'Dividers': 'dividers',
  'Vertical Divider': 'vertical-divider',
  'DecorationDiv': 'decoration-div',
  'DecorationGroup': 'decoration-group',
  'Dialog': 'dialog',
  'Dropdown Menu': 'dropdown-menu',
  'Popover': 'popover',
  'Sheet': 'sheet',
  'Help Panel': 'help-panel',
  'Context Menu': 'context-menu',
};

// ============================================================================
// Autocomplete Component
// ============================================================================

interface AutocompleteProps {
  query: string;
  suggestions: SearchableItem[];
  selectedIndex: number;
  onSelect: (item: SearchableItem) => void;
  onClose: () => void;
}

function Autocomplete({ query, suggestions, selectedIndex, onSelect, onClose }: AutocompleteProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0 && selectedIndex < suggestions.length) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, suggestions.length]);

  if (suggestions.length === 0 || !query) {
    return null;
  }

  const highlightText = (text: string, query: string) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <span className="bg-green">{text.substring(index, index + query.length)}</span>
        {text.substring(index + query.length)}
      </>
    );
  };

  return (
    <div
      ref={listRef}
      className="absolute z-50 w-full mt-1 bg-white border border-black rounded-sm shadow-[4px_4px_0_0_var(--color-black)] max-h-64 overflow-y-auto"
    >
      {suggestions.map((item, index) => {
        const sectionTitle = SECTION_TITLES[item.sectionId];
        const isSubsection = item.subsectionTitle !== undefined;
        const displayTitle = isSubsection ? item.subsectionTitle : sectionTitle;
        
        return (
          <button
            key={`${item.sectionId}-${item.text}-${index}`}
            type="button"
            onClick={() => onSelect(item)}
            className={`w-full text-left px-3 py-2 font-alfacad text-sm transition-colors ${
              index === selectedIndex
                ? 'bg-green text-black'
                : 'bg-white text-black hover:bg-black/5'
            } ${isSubsection ? 'pl-6' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                {displayTitle && (
                  <span className="font-space-mono text-xs font-bold text-black/60 uppercase">
                    {displayTitle}
                  </span>
                )}
                <span>{highlightText(item.text, query)}</span>
              </div>
              <span className="text-xs text-black/40 uppercase">{item.type}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

// Component sections for search filtering
const COMPONENT_SECTIONS = [
  { id: 'buttons', title: 'Buttons', content: <ButtonsContent /> },
  { id: 'cards', title: 'Cards', content: <CardsContent /> },
  { id: 'forms', title: 'Forms', content: <FormsContent /> },
  { id: 'feedback', title: 'Feedback', content: <FeedbackContent /> },
  { id: 'navigation', title: 'Navigation', content: <NavigationContent /> },
  { id: 'decorations', title: 'Decorations', content: <DecorationsContent /> },
  { id: 'overlays', title: 'Overlays', content: <OverlaysContent /> },
];

interface DesignSystemTabProps {
  searchQuery?: string;
}

export function DesignSystemTab({ searchQuery: propSearchQuery = '' }: DesignSystemTabProps) {
  const searchQuery = propSearchQuery;

  // Get matching suggestions (for autocomplete in footer)
  const suggestions = searchQuery
    ? SEARCH_INDEX.filter((item) =>
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10)
    : [];

  // Filter sections based on search query
  const filteredSections = searchQuery
    ? (() => {
        const queryLower = searchQuery.toLowerCase().trim();
        
        // Check for exact match first (case-insensitive)
        const exactMatch = SEARCH_INDEX.find(
          (item) => item.text.toLowerCase() === queryLower
        );
        
        if (exactMatch) {
          // If exact match is a subsection, we'll filter subsections via CSS
          if (exactMatch.subsectionTitle) {
            // Show the section containing this subsection
            return COMPONENT_SECTIONS.filter(
              (section) => section.id === exactMatch.sectionId
            );
          }
          // If exact match is a section title, show all subsections in that section
          if (exactMatch.type === 'section') {
            return COMPONENT_SECTIONS.filter(
              (section) => section.id === exactMatch.sectionId
            );
          }
          // Otherwise, only show the section containing that item
          return COMPONENT_SECTIONS.filter(
            (section) => section.id === exactMatch.sectionId
          );
        }
        
        // Check if query matches a subsection title
        const subsectionMatch = Object.keys(SUBSECTION_ID_MAP).find(
          (title) => title.toLowerCase() === queryLower
        );
        
        if (subsectionMatch) {
          const subsectionId = SUBSECTION_ID_MAP[subsectionMatch];
          // Find which section contains this subsection
          const subsectionItem = SEARCH_INDEX.find(
            (item) => item.subsectionTitle === subsectionMatch
          );
          if (subsectionItem) {
            return COMPONENT_SECTIONS.filter(
              (section) => section.id === subsectionItem.sectionId
            );
          }
        }
        
        // Check if query matches a section title
        const sectionMatch = Object.values(SECTION_TITLES).find(
          (title) => title.toLowerCase() === queryLower
        );
        
        if (sectionMatch) {
          // Show all subsections in that section
          const sectionId = Object.keys(SECTION_TITLES).find(
            (id) => SECTION_TITLES[id] === sectionMatch
          );
          if (sectionId) {
            return COMPONENT_SECTIONS.filter(
              (section) => section.id === sectionId
            );
          }
        }
        
        // Otherwise, use the existing fuzzy matching logic
        return COMPONENT_SECTIONS.filter((section) => {
          // Check if section title matches
          if (section.title.toLowerCase().includes(queryLower)) {
            return true;
          }
          // Check if any searchable item in this section matches
          return SEARCH_INDEX.some(
            (item) =>
              item.sectionId === section.id &&
              item.text.toLowerCase().includes(queryLower)
          );
        });
      })()
    : COMPONENT_SECTIONS;

  // Determine which subsection to show (if any)
  const activeSubsectionId = searchQuery
    ? (() => {
        const queryLower = searchQuery.toLowerCase().trim();
        const exactMatch = SEARCH_INDEX.find(
          (item) => item.text.toLowerCase() === queryLower
        );
        if (exactMatch?.subsectionTitle) {
          return SUBSECTION_ID_MAP[exactMatch.subsectionTitle];
        }
        const subsectionMatch = Object.keys(SUBSECTION_ID_MAP).find(
          (title) => title.toLowerCase() === queryLower
        );
        if (subsectionMatch) {
          return SUBSECTION_ID_MAP[subsectionMatch];
        }
        return null;
      })()
    : null;


  return (
    <ToastProvider>
      <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-[var(--color-white)] border border-black rounded">
        {/* Component Sections */}
        {activeSubsectionId && (
          <style>{`
            div[data-subsection-id]:not([data-subsection-id="${activeSubsectionId}"]) {
              display: none !important;
            }
          `}</style>
        )}
        <div className="space-y-0">
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <div key={section.id} className="mb-6">
                <Section title={section.title}>{section.content}</Section>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-black/60 font-alfacad text-base">
              No components match &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      </div>
    </ToastProvider>
  );
}
