import React from 'react';

const { useState } = React;
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const menuItems = {
  coffee: [
    {
      id: 1,
      name: 'Капучино',
      description: 'Эспрессо с молочной пеной',
      price: 250,
      image: 'https://cdn.poehali.dev/projects/2c6f8b9a-c4de-4c2f-b9db-02505f6fa9d0/files/40260c17-c654-4705-8ed4-17f3af276a82.jpg',
      category: 'coffee'
    },
    {
      id: 2,
      name: 'Латте',
      description: 'Кофе с молоком и легкой пенкой',
      price: 280,
      image: 'https://cdn.poehali.dev/projects/2c6f8b9a-c4de-4c2f-b9db-02505f6fa9d0/files/40260c17-c654-4705-8ed4-17f3af276a82.jpg',
      category: 'coffee'
    },
    {
      id: 3,
      name: 'Эспрессо',
      description: 'Классический крепкий кофе',
      price: 180,
      image: 'https://cdn.poehali.dev/projects/2c6f8b9a-c4de-4c2f-b9db-02505f6fa9d0/files/40260c17-c654-4705-8ed4-17f3af276a82.jpg',
      category: 'coffee'
    },
    {
      id: 4,
      name: 'Флэт Уайт',
      description: 'Двойной эспрессо с бархатной микропеной',
      price: 290,
      image: 'https://cdn.poehali.dev/projects/2c6f8b9a-c4de-4c2f-b9db-02505f6fa9d0/files/40260c17-c654-4705-8ed4-17f3af276a82.jpg',
      category: 'coffee'
    }
  ],
  desserts: [
    {
      id: 5,
      name: 'Круассан шоколадный',
      description: 'Свежая выпечка с бельгийским шоколадом',
      price: 180,
      image: 'https://cdn.poehali.dev/projects/2c6f8b9a-c4de-4c2f-b9db-02505f6fa9d0/files/a3fc5991-a9fe-4389-8aea-0b9181a31bd0.jpg',
      category: 'dessert'
    },
    {
      id: 6,
      name: 'Чизкейк Нью-Йорк',
      description: 'Классический десерт на основе сливочного сыра',
      price: 320,
      image: 'https://cdn.poehali.dev/projects/2c6f8b9a-c4de-4c2f-b9db-02505f6fa9d0/files/a3fc5991-a9fe-4389-8aea-0b9181a31bd0.jpg',
      category: 'dessert'
    },
    {
      id: 7,
      name: 'Тирамису',
      description: 'Итальянский десерт с маскарпоне и кофе',
      price: 350,
      image: 'https://cdn.poehali.dev/projects/2c6f8b9a-c4de-4c2f-b9db-02505f6fa9d0/files/a3fc5991-a9fe-4389-8aea-0b9181a31bd0.jpg',
      category: 'dessert'
    }
  ]
};

const locations = [
  {
    id: 1,
    name: 'Центр',
    address: 'ул. Тверская, 10',
    hours: '8:00 - 22:00',
    metro: 'Пушкинская'
  },
  {
    id: 2,
    name: 'Арбат',
    address: 'Старый Арбат, 25',
    hours: '9:00 - 23:00',
    metro: 'Арбатская'
  },
  {
    id: 3,
    name: 'Парк Культуры',
    address: 'ул. Остоженка, 5',
    hours: '8:00 - 21:00',
    metro: 'Парк Культуры'
  }
];

const offers = [
  {
    id: 1,
    title: 'Счастливые часы',
    description: 'Скидка 20% на все напитки с 15:00 до 17:00',
    discount: '20%'
  },
  {
    id: 2,
    title: 'Комбо завтрак',
    description: 'Кофе + круассан за 350₽ до 12:00',
    discount: '350₽'
  },
  {
    id: 3,
    title: 'Десерт в подарок',
    description: 'При покупке 2 напитков - любой десерт в подарок',
    discount: 'Подарок'
  }
];

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'preparing' | 'ready'>('idle');
  const [activeTab, setActiveTab] = useState('menu');

  const addToCart = (item: typeof menuItems.coffee[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    toast.success(`${item.name} добавлен в корзину`);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = () => {
    if (cart.length === 0) {
      toast.error('Корзина пуста');
      return;
    }
    setOrderStatus('preparing');
    toast.success('Заказ принят! Готовим ваш заказ...');
    
    setTimeout(() => {
      setOrderStatus('ready');
      toast.success('Заказ готов! Можете забрать в выбранной кофейне', {
        duration: 5000,
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                ☕
              </div>
              <h1 className="text-2xl font-bold text-foreground">Coffee House</h1>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between gap-4 pb-4 border-b">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.price}₽</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Icon name="Minus" size={14} />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Icon name="Plus" size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4">
                        <div className="flex justify-between text-lg font-semibold mb-4">
                          <span>Итого:</span>
                          <span>{totalPrice}₽</span>
                        </div>
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={placeOrder}
                          disabled={orderStatus !== 'idle'}
                        >
                          {orderStatus === 'idle' && 'Оформить заказ'}
                          {orderStatus === 'preparing' && (
                            <>
                              <Icon name="Clock" size={20} className="mr-2" />
                              Готовим...
                            </>
                          )}
                          {orderStatus === 'ready' && (
                            <>
                              <Icon name="CheckCircle" size={20} className="mr-2" />
                              Готово!
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="space-y-12 animate-fade-in">
            <section>
              <h2 className="text-3xl font-bold mb-6">Напитки</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {menuItems.coffee.map(item => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{item.price}₽</span>
                        <Button onClick={() => addToCart(item)}>
                          <Icon name="Plus" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6">Десерты</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.desserts.map(item => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{item.price}₽</span>
                        <Button onClick={() => addToCart(item)}>
                          <Icon name="Plus" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
        </section>

        <section className="mt-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Наши кофейни в Москве</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {locations.map(location => (
                  <Card key={location.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon name="MapPin" size={24} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1">{location.name}</h3>
                          <p className="text-sm text-muted-foreground">{location.address}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Icon name="Clock" size={16} className="text-muted-foreground" />
                          <span>{location.hours}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Train" size={16} className="text-muted-foreground" />
                          <span>{location.metro}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <Icon name="Navigation" size={16} className="mr-2" />
                        Построить маршрут
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
        </section>

        <section className="mt-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Специальные предложения</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {offers.map(offer => (
                  <Card
                    key={offer.id}
                    className="relative overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="absolute top-4 right-4">
                      <Badge className="text-lg px-4 py-2">{offer.discount}</Badge>
                    </div>
                    <CardContent className="p-6 pt-8">
                      <div className="mb-4">
                        <Icon name="Gift" size={32} className="text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                      <p className="text-muted-foreground">{offer.description}</p>
                      <Button className="w-full mt-6">
                        Использовать
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
        </section>

        <section className="mt-20">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block p-6 bg-primary/10 rounded-full mb-6">
                  <Icon name="Truck" size={48} className="text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Доставка по Москве</h2>
                <p className="text-lg text-muted-foreground">
                  Привезём ваш заказ тёплым в течение 30 минут
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3 mb-12">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="inline-block p-4 bg-accent/10 rounded-full mb-4">
                      <Icon name="Clock" size={32} className="text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Быстрая доставка</h3>
                    <p className="text-sm text-muted-foreground">В течение 30 минут</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="inline-block p-4 bg-accent/10 rounded-full mb-4">
                      <Icon name="ShieldCheck" size={32} className="text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Гарантия качества</h3>
                    <p className="text-sm text-muted-foreground">Горячие напитки</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="inline-block p-4 bg-accent/10 rounded-full mb-4">
                      <Icon name="Banknote" size={32} className="text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Бесплатно</h3>
                    <p className="text-sm text-muted-foreground">От 500₽</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-muted/30">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">Условия доставки</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <Icon name="CheckCircle2" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <span>Бесплатная доставка при заказе от 500₽</span>
                    </li>
                    <li className="flex gap-3">
                      <Icon name="CheckCircle2" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <span>Доставка в пределах МКАД - 200₽ для заказов до 500₽</span>
                    </li>
                    <li className="flex gap-3">
                      <Icon name="CheckCircle2" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <span>Оплата картой или наличными курьеру</span>
                    </li>
                    <li className="flex gap-3">
                      <Icon name="CheckCircle2" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <span>Отслеживание заказа в реальном времени</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
        </section>
      </main>

      <footer className="bg-muted/30 mt-20 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-semibold mb-4">О нас</h3>
              <p className="text-sm text-muted-foreground">
                Лучшая кофейня в Москве. Свежие зёрна, профессиональные бариста и уютная атмосфера.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>+7 (495) 123-45-67</p>
                <p>info@coffeehouse.ru</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Время работы</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Пн-Пт: 8:00 - 22:00</p>
                <p>Сб-Вс: 9:00 - 23:00</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Социальные сети</h3>
              <div className="flex gap-4">
                <Button variant="outline" size="icon">
                  <Icon name="Instagram" size={18} />
                </Button>
                <Button variant="outline" size="icon">
                  <Icon name="Facebook" size={18} />
                </Button>
                <Button variant="outline" size="icon">
                  <Icon name="Twitter" size={18} />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 Coffee House. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;