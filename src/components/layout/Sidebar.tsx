'use client'

import React from 'react';
import { motion as m } from 'framer-motion';
const motion = m;
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';
import { useNavigation } from '@/hooks/useNavigation/useNavigation';
import { LucideIcon } from 'lucide-react';
import { UserProfile } from './UserProfile';

interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  color?: 'default' | 'amber' | 'blue' | 'yellow';
}

interface SidebarProps {
  links: SidebarLink[];
}

export function Sidebar({ links }: SidebarProps) {
  const { collapsed, animationStage, handleMouseEnter, handleMouseLeave } = useSidebar();
  const { pathname: currentPathname } = useNavigation();

  // Função para manter sidebar expandida durante interação com UserProfile
  const handleUserProfileInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      className="bg-primary flex flex-col relative"
      {...(collapsed ? 
        // Fechamento em duas etapas com velocidades diferentes
        {
          initial: { width: 280 },
          animate: { width: animationStage === 1 ? 81 : 80 },
          transition: {
            duration: animationStage === 1 ? 0.22 : 0.5, // Primeira etapa 20% menos rápida
            ease: "linear"
          }
        } : {
          initial: { width: 80 },
          animate: { width: 280 },
          transition: {
            type: 'spring',
            stiffness: 120,
            damping: 18
          }
        }
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo e título - Altura fixa */}
      <div className='h-24 px-3 pt-3'>
        <div className={`flex ${collapsed ? 'justify-center' : 'items-center gap-4'} pt-0 w-full`}>
          {collapsed ? (
            <div className="flex justify-center items-center">
              <div className="w-[52px] h-[52px] rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">TM</span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-shrink-0">
                <div className="w-[64px] h-[64px] rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">TM</span>
                </div>
              </div>
              <motion.div 
                className="overflow-hidden flex-1"
                {...(collapsed ? 
                  {
                    initial: { width: 180 },
                    animate: { width: animationStage === 1 ? 0 : 0 },
                    transition: {
                      duration: animationStage === 1 ? 0.22 : 0.5,
                      ease: "linear"
                    }
                  } : {
                    initial: { width: 0 },
                    animate: { width: 180 },
                    transition: {
                      type: 'spring',
                      stiffness: 120,
                      damping: 18
                    }
                  }
                )}
              >
                <div className="w-[180px] flex flex-col whitespace-nowrap">
                  <h1 className='text-2xl font-bold text-primary-foreground leading-tight mb-1'>
                    Thiago Moura
                  </h1>
                  <span className='text-sm text-primary-foreground leading-tight'>Campanha 2026</span>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Navegação - Todos os cards padronizados */}
      <div className="flex-grow flex flex-col px-3 pt-4 space-y-3">
        {links.map((link, index) => {
          // Definir cores com base na propriedade color do link
          const colorScheme = {
            default: {
              gradient: 'from-white/20 to-white/10',
              border: 'border-white/30',
              hover: 'hover:from-white/25 hover:to-white/15',
              iconBg: 'bg-white/30',
              iconColor: 'text-white',
              textColor: 'text-white',
              subtextColor: 'text-white/80'
            },
            amber: {
              gradient: 'from-amber-500/20 to-amber-600/20',
              border: 'border-amber-500/30',
              hover: 'hover:from-amber-500/25 hover:to-amber-600/25',
              iconBg: 'bg-amber-500/30',
              iconColor: 'text-amber-400',
              textColor: 'text-amber-100',
              subtextColor: 'text-amber-200/80'
            },
            blue: {
              gradient: 'from-blue-500/20 to-blue-600/20',
              border: 'border-blue-500/30',
              hover: 'hover:from-blue-500/25 hover:to-blue-600/25',
              iconBg: 'bg-blue-500/30',
              iconColor: 'text-blue-400',
              textColor: 'text-blue-100',
              subtextColor: 'text-blue-200/80'
            },
            yellow: {
              gradient: '',
              border: 'border-primary-foreground',
              hover: 'hover:bg-white/10',
              iconBg: 'bg-primary-foreground/30',
              iconColor: 'text-primary-foreground',
              textColor: 'text-primary-foreground',
              subtextColor: 'text-primary-foreground'
            }
          };
          
          const colors = colorScheme[link.color || 'default'];
          
          return (
            <motion.div
              key={index}
              className={cn(
                'p-3 rounded-lg',
                `border ${colors.border}`,
                `cursor-pointer ${colors.hover}`,
                'transition-colors duration-200',
                'flex items-center',
                currentPathname === link.href && 'bg-white/15'
              )}
            >
              <Link href={link.href} className="flex items-center w-full">
                <div className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
                  <div className={`flex items-center justify-center w-6 h-6 ${colors.iconBg} rounded-lg`}>
                    <link.icon className={`w-4 h-4 ${colors.iconColor}`} />
                  </div>
                  {!collapsed && (
                    <div className="ml-3">
                      <p className={`text-xs font-medium ${colors.textColor}`}>{link.title}</p>
                      {link.description && (
                        <p className={`text-[10px] ${colors.subtextColor}`}>{link.description}</p>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* UserProfile na parte inferior */}
      <div 
        className="px-3 pb-4 mt-6"
        onMouseEnter={handleUserProfileInteraction}
        onClick={handleUserProfileInteraction}
      >
        {collapsed ? (
          // Modo colapsado - apenas avatar
          <div className="flex justify-center">
            <UserProfile collapsed={true} />
          </div>
        ) : (
          // Modo expandido - componente completo
          <div className="w-full">
            <UserProfile collapsed={false} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
