import React, { useCallback } from 'react';
import { Box, Card, Grid, Flex, Button } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getKbList, postCreateKb } from '@/api/plugins';
import dayjs from 'dayjs';
import { useGlobalStore } from '@/store/global';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/router';

const KbList = () => {
  const { setLoading } = useGlobalStore();
  const router = useRouter();
  const { toast } = useToast();

  const { data: kbList = [] } = useQuery(['getKbList'], getKbList);

  const handleCreateModel = useCallback(async () => {
    setLoading(true);
    try {
      const name = `知识库${kbList.length}`;
      const id = await postCreateKb({ name });
      toast({
        title: '创建成功',
        status: 'success'
      });
      router.push(`/knowledgeBase/detail?id=${id}&name=${name}`);
    } catch (err: any) {
      toast({
        title: typeof err === 'string' ? err : err.message || '出现了意外',
        status: 'error'
      });
    }
    setLoading(false);
  }, [kbList.length, router, setLoading, toast]);

  return (
    <>
      <Card px={6} py={4}>
        <Flex alignItems={'center'}>
          <Box fontSize={'xl'} fontWeight={'bold'} flex={1}>
            我的知识库
          </Box>
          <Button flex={'0 0 145px'} variant={'outline'} onClick={handleCreateModel}>
            新建知识库
          </Button>
        </Flex>
      </Card>

      <Grid mt={4} templateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr']} gridGap={4}>
        {kbList.map((item) => (
          <Card
            key={item._id}
            px={4}
            py={3}
            cursor={'pointer'}
            _hover={{
              bg: 'gray.50'
            }}
            onClick={() => router.push(`/knowledgeBase/detail?id=${item._id}&name=${item.name}`)}
          >
            <Box fontSize={'lg'} fontWeight={'bold'}>
              {item.name}
            </Box>
            <Flex mt={2} fontSize={'sm'}>
              <Box flex={'0 0 80px'}>数据量:</Box>
              <Box ml={2}>{item.totalData}</Box>
            </Flex>
            <Flex mt={2} fontSize={'sm'}>
              <Box flex={'0 0 80px'}>更新时间:</Box>
              <Box ml={2}>{dayjs(item.updateTime).format('YYYY/MM/DD HH:mm:ss')}</Box>
            </Flex>
          </Card>
        ))}
      </Grid>
    </>
  );
};

export default KbList;
